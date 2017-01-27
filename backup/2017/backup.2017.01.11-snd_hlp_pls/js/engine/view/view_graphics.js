"use strinct"

function ViewGraphics(amt) {
    this.graphics = {
        bg_blur : {
            canvas : null,
            ctx : null,
            css : "",
            blur : amt
        },
        main : {
            canvas : null,
            ctx : null,
            css : ""
        },
        fg_blur : {
            canvas : null,
            ctx : null,
            css : "",
            blur : amt / 4
        }
    }
}