import Elysia, { t } from "elysia";
import apply from "../../../util/apply";

export default new Elysia()
    .post("/magick", async (ctx) => {
        const { image, intensity } = ctx.body;
        
        if(!image.type.startsWith("image/")) {
            ctx.set.status = 422;
            
            return {
                error: "Invalid image type",
            };
        }
        
        const lower_bound = `${100 - intensity}%`;
        const upper_bound = `${100 + intensity}%`
        
        const r = await apply(["-liquid-rescale", lower_bound, "-liquid-rescale", upper_bound], await image.bytes());
        
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
            intensity: t.Numeric({
                title: "Intensity",
                description: "The intensity of the filter; higher is more intense (may affect returned image size).",
                default: 50,
                minimum: 0,
                maximum: 75,
            }),
        }),
        headers: t.Object({
            authorization: t.Optional(t.String()),
        }),
        // @ts-ignore
        type: "multipart/form-data",
        tags: ["filter", "funny"],
        detail: {
            summary: "Magick",
            description: "There's really no explaining this one, you'll just have to try it yourself.",
        }
    });