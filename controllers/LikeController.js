/**
 * Created by annae on 06.03.2018.
 */
const express = require('express');
const wrap = require('../Helpers/wrap');
const Joi = require('joi');

class LikeController {
    constructor(repository) {
        this.repository = repository;
        this.create = this.create.bind(this);
        this.delete = this.delete.bind(this);
       // this.validate = this.validate.bind(this);

        this.router = express.Router();
        this.routes = {
            '/:authorId/like/': [
                {method: 'post', cb: this.create},
            ],
            '/:authorId/like/:id': [
                {method: 'delete', cb: this.delete}
            ]
        };
        this.registerRoutes();
    }

    static validate(data) {
        const schema = Joi.object().keys({
            tweetId: Joi.number().integer()
        });

        let like = {
            tweetId: data.tweetId
        };

        let result = Joi.validate(like, schema, {presence: 'required'});
        return result.error;
    }

    async create(req, res) {
        if (LikeController.validate(req.body) === null) {
            req.body.authorId = req.params.authorId;
            const item = await this.repository.create(req.body);
            res.json(item.get({plain: true}));
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
    const controller = new LikeController(repository);
    return controller.router;
};