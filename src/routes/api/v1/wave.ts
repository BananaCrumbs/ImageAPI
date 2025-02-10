import Elysia, { t } from "elysia";
import apply from "../../../util/apply";

export default new Elysia()
    .post("/wave", async (ctx) => {
        const { image, amplitude, wavelength } = ctx.body;
        
        if(!image.type.startsWith("image/")) {
            ctx.set.status = 422;
            
            return {
                error: "Invalid image type",
            };
        }
        
        const r = await apply(["-wave", `${amplitude}x${wavelength}`], await image.bytes());
        
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
            amplitude: t.Numeric({
                title: "Wave Amplitude",
                description: "Higher = More wavyness",
                default: 5,
                minimum: 0,
                maximum: 100,
            }),
            wavelength: t.Numeric({
                title: "Wave Length",
                description: "The length of the waves",
                default: 100,
                minimum: 0,
                maximum: 5000,
            }),
        }),
        headers: t.Object({
            authorization: t.Optional(t.String()),
        }),
        // @ts-ignore
        type: "multipart/form-data",
        tags: ["filter", "utility"],
    });