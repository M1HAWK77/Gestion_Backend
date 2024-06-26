"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//to create our API REST
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
//routes
const product_routes_1 = __importDefault(require("../routes/product.routes"));
const user_routes_1 = __importDefault(require("../routes/user.routes"));
const category_routes_1 = __importDefault(require("../routes/category.routes"));
const supplier_routes_1 = __importDefault(require("../routes/supplier.routes"));
const productRegistration_routes_1 = __importDefault(require("../routes/productRegistration.routes"));
const productOutput_routes_1 = __importDefault(require("../routes/productOutput.routes"));
//creation of tables
const tblAssociation_models_1 = require("./tblAssociation.models");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.middlewares();
        this.routes();
        this.dbConnect();
    }
    //@app.listen(): initialize the web server on the specified port 
    listen() {
        this.app.listen(parseInt(this.port), '0.0.0.0', () => {
            console.log(`Application is running in port ${this.port}`);
        });
    }
    //@routes: configurate routes
    routes() {
        this.app.use('/api/products', product_routes_1.default);
        this.app.use('/api/users', user_routes_1.default);
        this.app.use('/api/categories', category_routes_1.default);
        this.app.use('/api/suppliers', supplier_routes_1.default);
        this.app.use('/api/productRegistration', productRegistration_routes_1.default);
        this.app.use('/api/productOutput', productOutput_routes_1.default);
    }
    /*@middlewares: check http request from server,
    if body is in json convert data to js object*/
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)({
            //origin: ['http://192.168.100.253:4200','localhost:4200'], // Solo permitir este dominio (comentar si es necesario)
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
            allowedHeaders: ['Content-Type', 'Authorization'] // Cabeceras permitidas
        }));
        //Security test changes
        this.app.disable('x-powered-by'); // Eliminar la cabecera X-Powered-By
        this.app.use(this.securityHeaders);
    }
    //Security changes (own middleware)
    securityHeaders(req, res, next) {
        res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.example.com; frame-src 'none'; object-src 'none'");
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-XSS-Protection", "1; mode=block");
        res.setHeader("Referrer-Policy", "no-referrer");
        res.setHeader("Permissions-Policy", "geolocation=(self), microphone=()");
        next();
    }
    /*@dbConnect: Asynchronous function that creates the database based on
    sequel rules*/
    dbConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //These lines of code the first time create my tables
                yield tblAssociation_models_1.User.sync();
                yield tblAssociation_models_1.Supplier.sync();
                yield tblAssociation_models_1.Category.sync();
                yield tblAssociation_models_1.Product.sync();
                yield tblAssociation_models_1.ProductRegistration.sync();
                yield tblAssociation_models_1.ProductOutput.sync();
                yield tblAssociation_models_1.DetailRegistration.sync();
                yield tblAssociation_models_1.DetailOutput.sync();
            }
            catch (error) {
                console.log('unable to connect to the database:', error);
            }
        });
    }
}
exports.default = Server;
