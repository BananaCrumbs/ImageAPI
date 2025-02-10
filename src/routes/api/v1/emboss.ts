import Elysia, { t } from "elysia";
import apply from "../../../util/apply";

export default new Elysia()
    .post("/emboss", async (ctx) => {
        const { image, embossity } = ctx.body;
        
        if(!image.type.startsWith("image/")) {
            ctx.set.status = 422;
            
            return {
                error: "Invalid image type",
            };
        }
        
        const r = await apply(["-colorspace", "Gray", "-emboss", `0x${embossity}`], await image.bytes());
        
        ctx.set.headers = {
            "content-type": "image/png",
        };
        
        return r.buffer;
    }, {
        body: t.Object({
            image: t.File({
                title: "Image",
                description: "The file to apply the filter to.",
                maxSize: 10 * 1024 * 1024, // 10 MB
            }),
            embossity: t.Numeric({
                title: "Embossity",
                description: "The embossity to apply to the image",
                default: 0.1,
                minimum: 0,
                maximum: 5,
            }),
        }),
        headers: t.Object({
            authorization: t.Optional(t.String()),
        }),
        // @ts-ignore
        type: "multipart/form-data",
        tags: ["filter", "utility"],
        detail: {
            summary: "Emboss",
            description: "Applies an emboss filter to an image.  I'm not too sure what this does, I just saw it on ImageMagick's documentation.",
        }
    });