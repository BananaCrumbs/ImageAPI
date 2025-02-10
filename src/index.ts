import Elysia from "elysia";
import routes from "./routes";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
    .use(swagger({
        autoDarkMode: false,
        provider: "scalar",
        scalarConfig: {
            darkMode: false,
            baseServerURL: "/api/v1",
            
        },
        documentation: {
            info: {
                title: "BananaCrumbs ImageAPI Documentation",
                version: "1",
                description: "Documentation for the ImageAPI service.  You can test any of the filters on https://imageapi.bananacrumbs.us/docs, and upload an image.  Currently, there is a rate limit of 10 requests per minute.  There are plans to add more endpoints in the future, but for now you can contribute to the repository on https://github.com/BananaCrumbs/ImageAPI to add more endpoints, or feel free to suggest ideas!",
            },
        },
        path: "/docs",
        swaggerOptions: {
            syntaxHighlight: {
                activate: true,
                theme: "idea"
            },
            filter: true,
        },
    }))
    .get("/", (ctx) => {
        ctx.set.headers = {
            "Location": "/docs",
        };
        
        ctx.set.status = 302;
        
        return {};
    }, {
        detail: {
            hide: true,
        }
    })
    .use(routes)

app.listen(55121);