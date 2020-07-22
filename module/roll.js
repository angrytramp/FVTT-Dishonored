export class DishonoredRoll {

    async performSkillTest(dicePool, checkTarget, focusTarget, selectedSkill, selectedStyle, speaker) {
        let i;
        let result = [];
        for (i = 1; i <= dicePool; i++) {
            let r = new Roll("d20");
            result.push(r.roll()._result);
        }
        let numberOfRegularSuccess = result.filter(x => x <= checkTarget && x > focusTarget).length;
        let numberOfComplications = result.filter(x => x == 20).length;
        let numberOfCriticalSuccess = result.filter(x => x <= focusTarget).length;
        let actualSuccess = numberOfRegularSuccess + 2 * numberOfCriticalSuccess;
        let diceString = "";
        for (i = 0; i <= result.length - 1; i++) {
            if (result[i] <= focusTarget) {
                diceString += '<li class="roll die d20 max">' + result[i] + '</li>';
            } else if (result[i] == 20) {
                diceString += '<li class="roll die d20 min">' + result[i] + '</li>';
            } else {
                diceString += '<li class="roll die d20">' + result[i] + '</li>';
            }
        }

        if (actualSuccess == 1) {
            var actualSuccessText = actualSuccess + game.i18n.format("dishonored.roll.success");
        } else {
            var actualSuccessText = actualSuccess + game.i18n.format("dishonored.roll.successPlural");
        }

        const multipleComplicationsAllowed = game.settings.get("FVTT-Dishonored", "multipleComplications");

        if (numberOfComplications >= 1) {
            if (numberOfComplications > 1 && multipleComplicationsAllowed === true) {
                var localisedPluralisation = game.i18n.format("dishonored.roll.complicationPlural")
                var complicationText = '<h4 class="dice-total failure"> ' + localisedPluralisation.replace('|#|', numberOfComplications) + '</h4>';
            } else {
                var complicationText = '<h4 class="dice-total failure"> ' + game.i18n.format("dishonored.roll.complication") + '</h4>';
            }
        } else {
            var complicationText = '';
        }

        let flavor = game.i18n.format("dishonored.actor.skill." + selectedSkill) + " " + game.i18n.format("dishonored.actor.style." + selectedStyle) + game.i18n.format("dishonored.roll.test");

        let html = `
			<div class="dice-roll">
				<div class="dice-result">
					<div class="dice-formula">
						<table>
							<tr>
								<td> ` + dicePool + `d20 </td>
								<td> Target:` + checkTarget + ` </td>
								<td> Focus:` + focusTarget + ` </td>
							</tr>
						</table>
					</div>
					<div class="dice-tooltip" style="display: block;">
						<section class="tooltip-part">
							<div class="dice">
								<ol class="dice-rolls" style="display: flex; justify-content: center;">` + diceString + `</ol>
							</div>
						</section>
					</div>` +
            complicationText +
            `<h4 class="dice-total">` + actualSuccessText + `</h4>
				</div>
			</div>
		`
        ChatMessage.create({
            user: game.user._id,
            isRoll: true,
            speaker: ChatMessage.getSpeaker({ actor: speaker }),
            flavor: flavor,
            content: html,
            sound: "sounds/dice.wav"
        }).then(msg => {
            return msg
        });
    }

    async performItemRoll(item, speaker) {
        console.log(item);
        var value = game.i18n.format("dishonored.roll.item.value");
        let html = `
            <div class='dishonored dice-roll'>
                <div class="dice-result">
                    <div class='item-roll-header dice-formula'>
                        <img class='item-roll-img' src=`+item.data.img+`></img>
                        <h1>`+item.data.name+`</h1>
                    </div>
                    <div class="dice-tooltip" style="display: block;">`+item.data.data.description+`</div>
                    <div class='tags'> 
                        <div>`+value.replace('|#|', item.data.data.cost)+`</div>
                    </div>
                <div>
            </div>
		`
        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: speaker }),
            content: html,
            sound: "sounds/dice.wav"
        }).then(msg => {
            return msg
        });
    }

    async performFocusRoll(item, speaker) {
        console.log(item);
        var variablePrompt = game.i18n.format("dishonored.roll.focus.rating");
        let html = `
            <div class='dishonored dice-roll'>
                <div class="dice-result">
                    <div class='item-roll-header dice-formula'>
                        <img class='item-roll-img' src=`+item.data.img+`></img>
                        <h1>`+item.data.name+`</h1>
                    </div>
                    <div class='dice-formula'> `+variablePrompt.replace('|#|', item.data.data.rating)+`</div>
                    <div class="dice-tooltip" style="display: block;">`+item.data.data.description+`</div>
                <div>
            </div>
		`
        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: speaker }),
            content: html,
            sound: "sounds/dice.wav"
        }).then(msg => {
            return msg
        });
    }

    async performBonecharmRoll(item, speaker) {
        console.log(item);
        let html = `
            <div class='dishonored dice-roll'>
                <div class="dice-result">
                    <div class='item-roll-header dice-formula'>
                        <img class='item-roll-img' src=`+item.data.img+`></img>
                        <h1>`+item.data.name+`</h1>
                    </div>
                    <div class="dice-tooltip" style="display: block;">`+item.data.data.description+`</div>
                <div>
            </div>
		`
        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: speaker }),
            content: html,
            sound: "sounds/dice.wav"
        }).then(msg => {
            return msg
        });
    }

    async performWeaponRoll(item, speaker) {
        console.log(item);
        var variablePrompt = game.i18n.format("dishonored.roll.weapon.damage");
        var value = game.i18n.format("dishonored.roll.item.value");
        let html = `
            <div class='dishonored dice-roll'>
                <div class="dice-result">
                    <div class='item-roll-header dice-formula'>
                        <img class='item-roll-img' src=`+item.data.img+`></img>
                        <h1>`+item.data.name+`</h1>
                    </div>
                    <div class='dice-formula'> `+variablePrompt.replace('|#|', item.data.data.damage)+`</div>
                    <div class="dice-tooltip" style="display: none;">`+item.data.data.description+`</div>
                    <div class='tags'> 
                        <div>`+value.replace('|#|', item.data.data.cost)+`</div>
                    </div>
                <div>
            </div>
		`
        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: speaker }),
            content: html,
            sound: "sounds/dice.wav"
        }).then(msg => {
            return msg
        });
    }

    async performArmorRoll(item, speaker) {
        console.log(item);
        var variablePrompt = game.i18n.format("dishonored.roll.armor.protect");
        var value = game.i18n.format("dishonored.roll.item.value");
        let html = `
            <div class='dishonored dice-roll'>
                <div class="dice-result">
                    <div class='item-roll-header dice-formula'>
                        <img class='item-roll-img' src=`+item.data.img+`></img>
                        <h1>`+item.data.name+`</h1>
                    </div>
                    <div class='dice-formula'> `+variablePrompt.replace('|#|', item.data.data.protection)+`</div>
                    <div class="dice-tooltip" style="display: block;">`+item.data.data.description+`</div>
                    <div class='tags'> 
                        <div>`+value.replace('|#|', item.data.data.cost)+`</div>
                    </div>
                <div>
            </div>
		`
        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: speaker }),
            content: html,
            sound: "sounds/dice.wav"
        }).then(msg => {
            return msg
        });
    }

    async performTalentRoll(item, speaker) {
        console.log(item);
        var variablePrompt = game.i18n.format("dishonored.roll.talent.type");
        let html = `
            <div class='dishonored dice-roll'>
                <div class="dice-result">
                    <div class='item-roll-header dice-formula'>
                        <img class='item-roll-img' src=`+item.data.img+`></img>
                        <h1>`+item.data.name+`</h1>
                    </div>
                    <div class='dice-formula'> `+variablePrompt.replace('|#|', item.data.data.type)+`</div>
                    <div class="dice-tooltip" style="display: block;">`+item.data.data.description+`</div>
                <div>
            </div>
		`
        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: speaker }),
            content: html,
            sound: "sounds/dice.wav"
        }).then(msg => {
            return msg
        });
    }

    async performContactRoll(item, speaker) {
        console.log(item);
        var variablePrompt = game.i18n.format("dishonored.roll.contact.relation");
        let html = `
            <div class='dishonored dice-roll'>
                <div class="dice-result">
                    <div class='item-roll-header dice-formula'>
                        <img class='item-roll-img' src=`+item.data.img+`></img>
                        <h1>`+item.data.name+`</h1>
                    </div>
                    <div class='dice-formula'> `+variablePrompt.replace('|#|', item.data.data.relationship)+`</div>
                    <div class="dice-tooltip" style="display: block;">`+item.data.data.description+`</div>
                <div>
            </div>
		`
        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: speaker }),
            content: html,
            sound: "sounds/dice.wav"
        }).then(msg => {
            return msg
        });
    }

    async performPowerRoll(item, speaker) {
        console.log(item);
        var variablePrompt = game.i18n.format("dishonored.roll.power.mana");
        var runeValue = game.i18n.format("dishonored.roll.power.rune");
        let html = `
            <div class='dishonored dice-roll'>
                <div class="dice-result">
                    <div class='item-roll-header dice-formula'>
                        <img class='item-roll-img' src=`+item.data.img+`></img>
                        <h1>`+item.data.name+`</h1>
                    </div>
                    <div class='dice-formula'> `+variablePrompt.replace('|#|', item.data.data.manacost)+`</div>
                    <div class="dice-tooltip" style="display: block;">`+item.data.data.description+`</div>
                    <div class='tags'> 
                        <div>`+runeValue.replace('|#|', item.data.data.runecost)+`</div>
                    </div>
                <div>
            </div>
		`
        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: speaker }),
            content: html,
            sound: "sounds/dice.wav"
        }).then(msg => {
            return msg
        });
    }




}