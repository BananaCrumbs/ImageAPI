import Elysia from "elysia";
import { rateLimit } from "elysia-rate-limit";
import magick from "./api/v1/magick";
import blur from "./api/v1/blur";
import deepfry from "./api/v1/deepfry";
import emboss from "./api/v1/emboss";
import explode from "./api/v1/explode";
import implode from "./api/v1/implode";
import invert from "./api/v1/invert";
import pixelate from "./api/v1/pixelate";
import sepia from "./api/v1/sepia";
import sketch from "./api/v1/sketch";
import spread from "./api/v1/spread";
import swirl from "./api/v1/swirl";
import wave from "./api/v1/wave";

export default new Elysia()
    .use(rateLimit({
        duration: 60000, // 1 minute
        max: 10, // 10 requests per minute
        generator: (req, srv) => {
            console.log("Request from", req.headers.get("CF-Connecting-IP"));
            return req.headers.get("CF-Connecting-IP") || "0.0.0.0";
        }
    }))
    .group("/api/v1", (app) => 
        app
            .use(magick)
            .use(blur)
            .use(deepfry)
            .use(emboss)
            .use(explode)
            .use(implode)
            .use(invert)
            .use(pixelate)
            .use(sepia)
            .use(sketch)
            .use(spread)
            .use(swirl)
            .use(wave)
    );