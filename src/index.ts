import Elysia from "elysia";
import routes from "./routes";
import swagger from "@elysiajs/swagger";
import { rateLimit } from "elysia-rate-limit";

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