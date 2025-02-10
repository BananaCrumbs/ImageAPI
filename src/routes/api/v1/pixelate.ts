import Elysia, { t } from "elysia";
import apply from "../../../util/apply";

export default new Elysia()
    .post("/pixelate", async (ctx) => {
        const { image, descale_amount, rescale_amount } = ctx.body;
        
        if(!image.type.startsWith("image/")) {
            ctx.set.status = 422;
            
            return {
                error: "Invalid image type",
            };
        }
        
        const r = await apply(["-scale", `${descale_amount}`, "-scale", `${rescale_amount}`], await image.bytes());
        
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
            descale_amount: t.Numeric({
                title: "Descale Amount",
                description: "The amount to down-scale the image by.",
                default: 100,
                minimum: 0,
                maximum: 1000,
            }),
            rescale_amount: t.Numeric({
                title: "Rescale Amount",
                description: "The amount to re-scale the image by.",
                default: 1000,
                minimum: 0,
                maximum: 1000,
            }),
        }),
        headers: t.Object({
            authorization: t.Optional(t.String()),
        }),
        // @ts-ignore
        type: "multipart/form-data",
        tags: ["filter", "utility"],
        detail: {
            summary: "Pixelate",
            description: "Applies a pixelation filter to the image by shrinking and then expanding it.",
        }
    });