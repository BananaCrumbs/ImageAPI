import Elysia, { t } from "elysia";
import apply from "../../../util/apply";

export default new Elysia()
    .post("/deepfry", async (ctx) => {
        const { image, embossity, modulation_a, modulation_b } = ctx.body;
        
        if(!image.type.startsWith("image/")) {
            ctx.set.status = 422;
            
            return {
                error: "Invalid image type",
            };
        }
        
        const r = await apply(["-modulate", `${modulation_a},${modulation_b}`, "-emboss", `0x${embossity}`], await image.bytes());
        
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
            modulation_a: t.Numeric({
                title: "Modulation A",
                description: "The first modulation parameter; higher is more intense.",
                default: 50,
                minimum: 1,
                maximum: 300,
            }),
            modulation_b: t.Numeric({
                title: "Modulation B",
                description: "The second modulation parameter; higher is more intense.",
                default: 200,
                minimum: 1,
                maximum: 300,
            }),
            embossity: t.Numeric({
                title: "Embossity",
                description: "The embossity; higher is more... something...",
                default: 1.1,
                minimum: 0,
                maximum: 5,
            }),
        }),
        headers: t.Object({
            authorization: t.Optional(t.String()),
        }),
        // @ts-ignore
        type: "multipart/form-data",
        tags: ["filter", "funny"],
        detail: {
            summary: "Deepfry",
            description: "Applies a deepfry filter to the image, making it appear like the glorious memes of 2016-2018."
        }
    });