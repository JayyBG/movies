"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const middleware_1 = __importDefault(require("./middleware"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(express_1.default.static(path_1.default.resolve(__dirname, '..', 'public')));
app.use((0, morgan_1.default)('[:date[web]] :method :url - :req[origin] - :response-time ms - :req[cf-connecting-ip]', {
    skip: (req, _res) => {
        if (req.method === "OPTIONS")
            return true;
        if (req.path.startsWith("/stream"))
            return true;
        return false;
    }
}));
app.use(middleware_1.default);
app.use(routes_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Stream API running on port ${process.env.PORT}`);
});
