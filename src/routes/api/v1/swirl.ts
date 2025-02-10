import Elysia, { t } from "elysia";
import apply from "../../../util/apply";

export default new Elysia()
    .post("/swirl", async (ctx) => {
        const { image, degrees } = ctx.body;
        
        if(!image.type.startsWith("image/")) {
            ctx.set.status = 422;
            
            return {
                error: "Invalid image type",
            };
        }
        
        const r = await apply(["-swirl", `${degrees}`], await image.bytes());
        
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
            degrees: t.Numeric({
                title: "Rotation Amount",
                description: "The rotation of the swirl in degrees",
                default: 100,
                minimum: -720,
                maximum: 720,
            }),
        }),
        headers: t.Object({
            authorization: t.Optional(t.String()),
        }),
        // @ts-ignore
        type: "multipart/form-data",
        tags: ["filter", "utility", "funny"],
        detail: {
            summary: "Swirl",
            description: "Create a swirl in the center of the image."
        },
    });