/**
 * Created by annae on 06.03.2018.
 */
const express = require('express');
const wrap = require('../Helpers/wrap');
const Joi = require('joi');

class TweetController {
    constructor(repository, userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.readAll = this.readAll.bind(this);
        this.read = this.read.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);

        this.defaults = {
            limit: 10,
            page: 1,
            sortOrder: 'desc',
            sortField: 'publishedOn'
        };

        this.router = express.Router();
        this.routes = {
            '/:authorId/tweet/': [
                {method: 'get', cb: this.readAll},
                {method: 'post', cb: this.create},
            ],
            '/:authorId/tweet/:id': [
                {method: 'get', cb: this.read},
                {method: 'put', cb: this.update},
                {method: 'delete', cb: this.delete}
            ]
        };
        this.registerRoutes();
    }

    static validate(data) {
        const schema = Joi.object().keys({
            message: Joi.string(),
            publishedOn: Joi.string()
        });

        let tweet = {
            message: data.message,
            publishedOn: data.publishedOn
        };

        let result = Joi.validate(tweet, schema, {presence: 'required'});
        return result.error;
    }

    async readAll(req, res) {
        const options = {
            limit: Number(req.query.limit) || this.defaults.limit,
            page: Number(req.query.page) || this.defaults.page,
            sortOrder: req.query.order || this.defaults.sortOrder,
            sortField: req.query.field || this.defaults.sortField
        };
        const offset = (options.page - 1) * options.limit;
        let data;
        if(options.sortField === 'author.name'){
            data = await this.repository.findAndCountAll({
                where: {authorId: req.params.authorId},
                limit: options.limit,
                offset: offset,
                order: [[
                    options.sortOrder.toUpperCase()
                ]],
                include: [{
                    model: this.userRepository,
                    order: [[
                        options.sortField
                    ]],
                }]
            });

        }
        else{
            data = await this.repository.findAndCountAll({
                where: {authorId: req.params.authorId},
                limit: options.limit,
                offset: offset,
                order: [[
                    options.sortField,
                    options.sortOrder.toUpperCase()
                ]]
            });
        }



        let result = {
            "tweets": data.rows,
            "meta": {
                "offset": options.offset,
                "count": data.count,
                "limit": options.limit,
                "pages": Math.ceil(data.count / options.limit),
                "page": options.page,
                "sortOrder": options.sortOrder,
                "sortField": options.sortField
            }
        };
        res.json(result);
    }

    async read(req, res) {
        const data = await this.repository.findById(req.params.id, {where: {authorId: req.params.authorId}});
        res.json(data);
    }

    async create(req, res) {
        if (TweetController.validate(req.body) === null) {
            req.body.authorId = req.params.authorId;
            const item = await this.repository.create(req.body);
            res.json(item.get({plain: true}));
        }
        else {
            res.json({"Error": "Invalid data"});
        }
    }

    async update(req, res) {
        if (TweetController.validate(req.body) === null) {
            req.body.authorId = req.params.authorId;
            await this.repository.update(req.body,
                {
                    where: {id: req.params.id},
                    limit: 1
                });
            await this.read(req, res);
        }
        else {
            res.json({"Error": "Invalid data"});
        }
    }

    async delete(req, res) {
        await this.repository.destroy({where: {id: req.params.id}});
        res.json({"Deleted record id": req.params.id});
    }

    registerRoutes() {
        Object.keys(this.routes).forEach(route => {
            let handlers = this.routes[route];

            if (!handlers || !Array.isArray(handlers)) {
                return;
            }

            for (let handler of handlers) {
                this.router[handler.method](
                    route,
                    wrap(handler.cb)
                );
            }
        });
    }

}

module.exports = (repository) => {
    const controller = new TweetController(repository);
    return controller.router;
};