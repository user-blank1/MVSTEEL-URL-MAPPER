/**
 * URL Mapper Worker
 * Redirects old URLs to new frontend structure
 * Proxies all other requests to Netlify
 */

const NETLIFY_SITE = "https://mv-steel-fe.netlify.app";

// URL mapping rules: old path → new path
const URL_MAP = {
    "/": "/lt",
    "/en": "/en",
    "/ru": "/ru",
    "/apie-kompanija": "/lt/about",
    "/en/about-company": "/en/about",
    "/ru/о-компании": "/ru/about",
    "/parduotuve": "/lt/products",
    "/en/parduotuve": "/en/products",
    "/nerudijantis-plienas/nerudijancio-plieno-strypai/": "/lt/products/stainless-steel/all?category=stainless-steel-bars",
    "/en/stainless-steel/stainless-steel-bars": "/en/products/stainless-steel/all?category=stainless-steel-bars",
    "/ru/нержавеющая-сталь/cортовой-прокат/": "/ru/products/stainless-steel/all?category=stainless-steel-bars",
    "/nerudijantis-plienas/jungiamosios-dalys/": "/lt/products/stainless-steel/all?view=grid&category=stainless-steel-industry-fittings",
    "/en/stainless-steel/stainless-steel-connecting-fittings/": "/en/products/stainless-steel/all?view=grid&category=stainless-steel-industry-fittings",
    "ru/нержавеющая-сталь/трубопроводная-арматура/": "/ru/products/stainless-steel/all?view=grid&category=stainless-steel-industry-fittings",
    "/nerudijantis-plienas/nerudijancio-plieno-lakstai": "/lt/products/stainless-steel/stainless-steel-sheets",
    "/en/stainless-steel/stainless-steel-sheets/": "/en/products/stainless-steel/stainless-steel-sheets",
    "/ru/нержавеющая-сталь/листы-из-нержавеющей-стали/": "/ru/products/stainless-steel/stainless-steel-sheets",
    "/nerudijantis-plienas/nerudijancio-plieno-ritiniai/": "/lt/products/stainless-steel/stainless-steel-coils",
    "/en/stainless-steel/stainless-steel-rolls-coils/": "/en/products/stainless-steel/stainless-steel-coils",
    "/ru/нержавеющая-сталь/рулонная-нержавеющая-сталь/": "/ru/products/stainless-steel/stainless-steel-coils",
    "/nerudijantis-plienas/tureklu-dalys-is-nerudijancio-plieno/": "/lt/products/stainless-steel/all?category=stainless-steel-railing-connection-fittings",
    "/en/stainless-steel/stainless-steel-railing-systems-and-fittings/":
        "/en/products/stainless-steel/all?category=stainless-steel-railing-connection-fittings",
    "/ru/нержавеющая-сталь/комплектующие-для-ограждений/": "/ru/products/stainless-steel/all?category=stainless-steel-railing-connection-fittings",
    "/nerudijantis-plienas/nerudijancio-plieno-vamzdziai/": "/lt/products/stainless-steel/all?category=stainless-steel-tubes",
    "/en/stainless-steel/stainless-steel-tubes/": "/en/products/stainless-steel/all?category=stainless-steel-tubes",
    "/ru/нержавеющая-сталь/трубы-из-нержавеющей-стали/": "/ru/products/stainless-steel/all?category=stainless-steel-tubes",
};

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        let oldPath = url.pathname + url.search; //what user entered

        // Normalize: remove trailing slash for matching (except root)
        const pathOnly = url.pathname;
        const normalizedPath = pathOnly.length > 1 && pathOnly.endsWith("/") ? pathOnly.slice(0, -1) : pathOnly;

        // Check if this URL needs to be redirected
        for (const [oldPattern, newPath] of Object.entries(URL_MAP)) {
            const normalizedPattern = oldPattern.length > 1 && oldPattern.endsWith("/") ? oldPattern.slice(0, -1) : oldPattern;

            if (normalizedPath === normalizedPattern || normalizedPath.startsWith(normalizedPattern + "/")) {
                // Redirect to new URL structure
                const newUrl = new URL(newPath, url.origin);
                newUrl.search = url.search; // Preserve query parameters

                return Response.redirect(newUrl.toString(), 301);
            }
        }

        // No mapping found - proxy request to Netlify
        const netlifyUrl = new URL(url.pathname + url.search, NETLIFY_SITE);

        // Fetch from Netlify
        const response = await fetch(netlifyUrl.toString(), {
            method: request.method,
            headers: request.headers,
            body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
        });

        // Return the response from Netlify
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    },
};
