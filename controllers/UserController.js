/**
 * Created by annae on 06.03.2018.
 */
const express = require('express');
const wrap = require('../Helpers/wrap');
const Joi = require('joi');

class UserController {
    constructor(repository) {
        this.repository = repository;
        this.readAll = this.readAll.bind(this);
        this.read = this.read.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
       // this.validate = this.validate.bind(this);


        this.router = express.Router();
        this.routes = {
            '/': [
                {method: 'get', cb: this.readAll},
                {method: 'post', cb: this.create},
            ],
            '/:id': [
                {method: 'get', cb: this.read},
                {method: 'put', cb: this.update},
                {method: 'delete', cb: this.delete}
            ]
        };
        this.registerRoutes();
    }

    static validate(data) {
        const schema = Joi.object().keys({
            name: Joi.string(),
            email: Joi.string().email()
        });

        let user = {
            name: data.name,
            email: data.email
        };

        let result = Joi.validate(user, schema, {presence: 'required'});
        return result.error;
    }

    async readAll(req, res) {
        const data = await this.repository.findAll({raw: true});
        res.json(data);
    }

    async read(req, res) {
        const data = await this.repository.findById(req.params.id);
        res.json(data);
    }

    async create(req, res) {
        if (UserController.validate(req.body) === null) {
            const item = await this.repository.create(req.body);
            res.json(item.get({plain: true}));
        }
        else {
            res.json({"Error": "Invalid data"});
        }
    }

    async update(req, res) {
        if (UserController.validate(req.body) === null) {
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
    const controller = new UserController(repository);
    return controller.router;
};