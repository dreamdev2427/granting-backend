const db = require("../../db");
const Collection = db.Collection;
const Follows = db.Follow;
const Users = db.User;
const Notify = db.Notify;
const fs = require('fs');
const fsPromises = fs.promises;
const env = require("../../../env");
const upload_path = env.upload_path;

var ObjectId = require('mongodb').ObjectID;

exports.create = async (req, res) => {

    // console.log("creting collection 00");

    // console.log("req.body = ", req.body);

    var reqItem = req.body;
    const collection = new Collection({
        name: reqItem.collectionName,
        logoURL: reqItem.collectionLogoURL,
        bannerURL: reqItem.collectionBannerURL,
        description: reqItem.collectionDescription,
        category: reqItem.collectionCategory,
        price: reqItem.price,
        metaData: reqItem.metaData,
        owner: ObjectId(reqItem.owner)
    });

    Collection.find({ name: reqItem.collectionName }, async function (err, docs) {
        if (err) {
            //return  res.status(501).send({ success: false, message: "Internal Server Error." });
        }
        if (docs.length > 0) {
            return res.status(501).send({ success: false, message: "Collection name is duplicated." });
        } else {
            await fsPromises.mkdir(process.cwd() + upload_path + reqItem.collectionName, { recursive: true })
                .then(async function () {
                    // console.log('Directory created successfully');

                    await collection
                        .save()
                        .then(async (data) => {
                            // console.log("Creating new collection succeed.");

                            const new_notify = new Notify(
                                {
                                    url: "/collectionItems/" + data.collection_id,
                                    imgUrl: data.logoURL,
                                    subTitle: "New collection is created.",
                                    description: "Collection " + data.name + " is created",
                                    date: new Date(),
                                    readers: [],
                                    target_ids: [],
                                    Type: 2
                                });
                            await new_notify.save(function (err) {
                                if (!err) {

                                }
                            });
                            return res.status(200).send(
                                { success: true, data, message: "New collection successfully created." }
                            );
                        })
                        .catch((err) => {
                            return res.status(500).send({
                                success: false,
                                message: err.message || "Some error occurred while creating the collection.",
                            });
                        });
                }
                ).catch(async function (err) {
                    // console.log('failed to create directory. ', err);
                    let errno = err.errno;
                    if (errno === -4075) {
                        // console.log("Collection dir already exists");

                        await collection
                            .save()
                            .then(async (data) => {
                                // console.log("Creating new collection succeed.");
                                const new_notify = new Notify(
                                    {
                                        url: "/collectionItems/" + data.collection_id,
                                        imgUrl: data.logoURL,
                                        subTitle: "New collection is created.",
                                        description: "Collection " + data.name + " is created",
                                        date: new Date(),
                                        readers: [],
                                        target_ids: [],
                                        Type: 2
                                    });
                                await new_notify.save(function (err) {
                                    if (!err) {

                                    }
                                });
                                return res.status(200).send(
                                    { success: true, data, message: "New collection successfully created." }
                                );
                            }).catch((err) => {
                                return res.status(500).send({
                                    success: false,
                                    message: err.message || "Some error occurred while creating the collection.",
                                });
                            });
                    }
                });
        }
    })
}

exports.getDetail = (req, res) => {
    // console.log("req.body._id  : ", req.body._id);
    Collection.findOne({ _id: new ObjectId(req.body._id) }).populate("owner")
        .then((docs) => {
            if (docs !== null && docs !== undefined) {
                // console.log("found a collection : ", docs);
                return res.status(200).send({ success: true, data: docs, message: "success" });
            }
            else return res.status(404).send({ success: false, data: [], message: "Can't find such asset." });
        })
        .catch((err) => {
            console.log("Collection doesn't exisit" + err.message);
            return res.status(500).send({ success: false, message: "Internal server Error" });
        })
}

exports.update = async (req, res) => {
    try {
        await Collection.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    ...req.body
                },
                $currentDate: {
                    ends: true,
                }
            },
            { upsert: true }
        );
    } catch (err) {
        console.log("Updating collection : " + err.message);
        return res.status(500).send({ success: false, message: "Internal server Error" });
    }
    // console.log("Updating collection : succeed.");
    return res.status(200).json({ success: true, message: "Successfully Update a Collection" })

}

exports.getHotCollections = (req, res) => {
    var limit = req.body.limit ? req.body.limit : 3;

    Collection.aggregate([

        {
            $unwind: "$items"
        },
        {
            $lookup: {
                from: "items",
                localField: "items",
                foreignField: "_id",
                as: "item_info"
            }
        },
        {
            $unwind: "$item_info"
        },
        {
            $group: {
                _id: "$_id",
                like_count: {
                    $sum: {
                        $size: "$item_info.likes"
                    }
                }
            }
        },
        {
            $lookup: {
                from: "collections",
                localField: "_id",
                foreignField: "_id",
                as: "collection_info"
            }
        },
        {
            $unwind: "$collection_info"
        },
        {
            $lookup: {
                from: "items",
                localField: "collection_info.items",
                foreignField: "_id",
                as: "items_list"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "collection_info.owner",
                foreignField: "_id",
                as: "creator_info"
            }
        },

        {
            $unwind: "$creator_info"
        },
        { $limit: limit },
        { $sort: { like_count: -1 } }
    ]).then((data) => {
        return res.send({ code: 0, data: data });
    }).catch(() => {
        return res.send({ code: 1, data: [] });
    });

}

// param.price = price.value;
// param.likes = likes.value;
// param.creator = creator.value;
// param.range = range;


exports.getCollectionList = async (req, res) => {

    console.log("sort param", req.body);
    var category = req.body.category ? req.body.category : 0;
    var date = req.body.date;
    var start = req.body.start;
    var last = req.body.last;
    var creator = req.body.creator ? req.body.creator : 0;
    var likes = req.body.likes ? req.body.likes : 0;
    var price = req.body.price ? req.body.price : 0;
    var range = req.body.range ? req.body.range : null;
    var search = req.body.search ? req.body.search : "";
    var collection_id = req.body.collection_id ? req.body.collection_id : 0;
    var metadatas = req.body.metadata ? req.body.metadata : [];
    var status = req.body.status ? req.body.status : 0;
    var sortmode = req.body.sortmode ? req.body.sortmode : 0;





    var creatorFilter = { $match: {} };
    var categoryFilter = { $match: {} };
    var dateSort = {};
    var likeSort = {};
    var priceSort = {};
    var rangeFilter = [{ $match: {} }, { $match: {} }];
    var searchFilter = { $match: {} };
    var collectionFilter = { $match: {} };
    var metadataFilter = { $match: {} };
    var statusFilter = { $match: {} };

    if (search != "") {
        searchFilter = {
            $match: {
                "item_info.name": {
                    $regex: `.*${search}.*`,
                    $options: 'i'
                }
            }
        }
    }


    if (creator == 1) {
        //verified users list
        var userlist = await Users.find({ verified: true });
        var list = [];
        for (var i = 0; i < userlist.length; i++) {
            list.push(userlist[i]._id);
        }
        creatorFilter = { $match: { "item_info.creator": { "$in": list } } };
    }

    if (category != 0) {
        categoryFilter = {
            $match: { category: category }
        }
    }

    if (range) {
        if (range[0] != '' && range[1] != '') {
            rangeFilter = [{ $match: { "item_info.price": { $gte: Number(range[0]) } } },
            { $match: { "item_info.price": { $lte: Number(range[1]) } } }];
        } else if (range[0] != '' && range[1] == '') {
            rangeFilter = [{ $match: { "item_info.price": { $gte: Number(range[0]) } } },
            { $match: {} }];
        } else if (range[0] == '' && range[1] != '') {
            rangeFilter = [{ $match: {} },
            { $match: { "item_info.price": { $lte: Number(range[1]) } } }];
        } else if (range[0] == '' && range[1] == '') {
            rangeFilter = [{ $match: {} }, { $match: {} }];
        }
    }

    if (collection_id != 0) {
        collectionFilter = { $match: { "_id": ObjectId(collection_id) } };
    }

    if (status != 0) {
        statusFilter = { $match: { "item_info.isSale": status } };
    }


    if (metadatas.length > 0) {
        var list = [];
        for (var i = 0; i < metadatas.length; i++) {
            list.push({
                "item_info.metaData": { $regex: new RegExp(metadatas[i], "g") }
            });
        }

        metadataFilter = {
            $match: {
                "$or": list
            }
        }
    }


    if (date == 0) {
        dateSort = { $sort: { "item_info.createdAt": -1 } };
    } else if (date == 1) {
        dateSort = { $sort: { "item_info.createdAt": 1 } };
    }

    if (likes == 0) {
        likeSort = { $sort: { "likes": -1 } };
    } else if (likes == 1) {
        likeSort = { $sort: { "likes": 1 } };
    }

    if (price == 0) {
        priceSort = { $sort: { "item_info.price": -1 } };
    } else if (price == 1) {
        priceSort = { $sort: { "item_info.price": 1 } };
    }

    var sort = {};
    if (sortmode == 0) {
        sort = { $sort: { "item_info.createdAt": -1 } };
    } else if (sortmode == 1) {
        sort = { $sort: { "item_info.createdAt": 1 } };
    } else if (sortmode == 2) {
        sort = { $sort: { "item_info.price": 1 } };
    } else if (sortmode == 3) {
        sort = { $sort: { "item_info.price": -1 } };
    } else if (sortmode == 4) {
        sort = { $sort: { "likes": -1 } };
    } else if (sortmode == 5) {
        sort = { $sort: { "likes": 1 } };
    }

    Collection.aggregate([
        collectionFilter,
        categoryFilter,
        {
            $unwind: "$items"
        },
        {
            $lookup: {
                from: "items",
                localField: "items",
                foreignField: "_id",
                as: "item_info"
            }
        },
        {
            $unwind: "$item_info"
        },
        {
            $lookup: {
                from: 'users',
                localField: "item_info.creator",
                foreignField: "_id",
                as: "creator_info"
            }
        },
        {
            $unwind: "$creator_info"
        },
        {
            $lookup: {
                from: "users",
                localField: "item_info.owner",
                foreignField: "_id",
                as: "owner_info"
            }
        },
        {
            $unwind: "$owner_info"
        },
        {
            $project: {
                "item_info": 1,
                "creator_info": 1,
                "owner_info": 1,
                "likes": { $size: "$item_info.likes" }
            }
        },
        searchFilter,
        metadataFilter,
        rangeFilter[0],
        rangeFilter[1],
        creatorFilter,
        statusFilter,
        // likeSort,
        // dateSort,
        // priceSort,
        sort,
        {
            $skip: Number(start)
        },
        {
            $limit: Number(last) - Number(start)
        }
    ]).then((data) => {
        return res.send({ code: 0, list: data });
    }).catch((error) => {
        return res.send({ code: 1 });
    });
}

exports.getUserCollectionList = (req, res) => {
    const userId = req.body.userId;
    const limit = req.body.limit;

    Collection.find({ owner: ObjectId(userId) })
        .skip(0).limit(limit)
        .then((docs) => {
            return res.status(200).send({ success: true, data: docs, message: "success" });
        })
        .catch((err) => {
            console.log("Hot collection doesn't exisit" + err.message);
            return res.status(500).send({ success: false, message: "Internal server Error" });
        })
}

exports.getNewCollectionList = (req, res) => {
    Collection
        .find()
        .populate("owner")
        .sort({ createdAt: -1 })
        .limit(4)
        .then((data) => {
            return res.send({ code: 0, data: data });
        })
        .catch(() => {
            return res.send({ code: 1 });
        });
}

exports.getCollectionNames = (req, res) => {
    var name = req.body.name ? req.body.name : "";
    var limit = req.body.limit ? req.body.limit : 0;

    Collection.find({ name: { $regex: new RegExp("^" + name, "i") } }, { "_id": 1, "name": 1 })
        .sort({ createdAt: -1 })
        // .sort({ name: 1 })
        .skip(0)
        .limit(limit)
        .then((data) => {
            return res.send({ code: 0, list: data });
        }).catch(() => {
            return res.send({ code: 0, list: [] });
        })
}


exports.getCollectionMetadatas = (req, res) => {
    var id = req.body._id;
    Collection.find({ _id: ObjectId(id) }, { metaData: 1 }).then((data) => {
        return res.send({ code: 0, data: data });
    }).catch(() => {
        return res.send({ code: 1, data: data });
    })
}