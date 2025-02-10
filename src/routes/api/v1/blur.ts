import Elysia, { t } from "elysia";
import apply from "../../../util/apply";

export default new Elysia()
    .post("/blur", async (ctx) => {
        const { image, intensity } = ctx.body;
        
        if(!image.type.startsWith("image/")) {
            ctx.set.status = 422;
            
            return {
                error: "Invalid image type",
            };
        }
        
        const r = await apply(["-blur", `0x${intensity}`], await image.bytes());
        
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
                description: "The intensity of the filter; higher is more intense.",
                default: 10,
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
            summary: "Blur",
            description: "Blur an image, uses a separable Gaussian convolution blur.  Accepts an intensity, which increases the blur amount.",
        },
    });