/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class DishonoredContactSheet extends ItemSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["dishonored", "sheet", "item", "contact"],
            template: "systems/FVTT-Dishonored/templates/items/contact-sheet.html",
            width: 500,
            height: 400,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        const data = super.getData();
        data.dtypes = ["String", "Number", "Boolean"];

        return data;
    }

    /* -------------------------------------------- */

    /** @override */
    setPosition(options = {}) {
        const position = super.setPosition(options);
        const sheetBody = this.element.find(".sheet-body");
        const bodyHeight = position.height - 192;
        sheetBody.css("height", bodyHeight);
        return position;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        var appId = this.appId;

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) {
            html.find('.send2actor')[0].style.display = 'none';
            html.find('.description')[0].style.height = 'calc(100% - 50px)';
            return;
        }

        if (!game.user.hasRole(game.settings.get("FVTT-Dishonored", "send2ActorPermissionLevel"))) {
            html.find('.send2actor')[0].style.display = 'none';
        }
        else {
            html.find('.send2actor').click(ev => {
                var name = $("[data-appid="+appId+"]").find('#name')[0].value;
                var description = $("[data-appid="+appId+"]").find('.editor-content')[0].innerHTML;
                var img = $("[data-appid="+appId+"]").find('.img')[0].getAttribute("src");
                this.send2Actor(name, description, img).then(created => ui.notifications.info("NPC with the name: '"+name+"' has been created!"));
            });
        }
    }

    async send2Actor(name, description, img) {
        let actor = await Actor.create({
            name: name,
            type: "npc",
            img: img,
            sort: 12000,
            data: {
                notes: description
            },
            token: {},
            items: [],
            flags: {}
          });
    }
}