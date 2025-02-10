import Elysia, { t } from "elysia";
import apply from "../../../util/apply";

export default new Elysia()
    .post("/sepia", async (ctx) => {
        const { image, tone } = ctx.body;
        
        if(!image.type.startsWith("image/")) {
            ctx.set.status = 422;
            
            return {
                error: "Invalid image type",
            };
        }
        
        const r = await apply(["-sepia-tone", `${tone}`], await image.bytes());
        
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
            tone: t.Numeric({
                title: "Sepia Tone",
                description: "Control the tone of the filter",
                default: 80,
                minimum: 0,
                maximum: 100,
            }),
        }),
        headers: t.Object({
            authorization: t.Optional(t.String()),
        }),
        // @ts-ignore
        type: "multipart/form-data",
        tags: ["filter", "utility"],
        detail: {
            summary: "Sepia",
            description: "Applies a sepia filter to the image.  I'm not too sure about how this works or who would use it, but it was on ImageMagick documentation.",
        }
    });