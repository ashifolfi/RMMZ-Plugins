//=============================================================================
// RPG Maker MZ - Earthbound battle backgrounds
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [MZ] [Battle]
 * @author Eden
 *
 * @help
 * Replaces the battle backgrounds with earthbound style effects.
 */

const shdBack1 = `
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float amp;
uniform float freq;
uniform float time;

void main(void)
{
    vec2 new_uv = vTextureCoord;
    if (vTextureCoord.y > 0.44)
    {
        new_uv.x += sin(freq * vTextureCoord.y + time) / amp;
    }

    // Texel color fetching from texture sampler
    gl_FragColor = texture2D(uSampler, new_uv);
}
`;

const shdVertOsc = `
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float amp;
uniform float freq;
uniform float time;

void main(void)
{
    vec2 new_uv = vTextureCoord;
    new_uv.y += sin(freq * vTextureCoord.y + time) / amp;

    // Texel color fetching from texture sampler
    gl_FragColor = texture2D(uSampler, new_uv);
}
`;

(function() {
    // required or else graphics look weird on sine wave
    PIXI.settings.WRAP_MODE = PIXI.WRAP_MODES.REPEAT;

    Spriteset_Battle.prototype.createBattlebackOg = Spriteset_Battle.prototype.createBattleback;
    Spriteset_Battle.prototype.createBattleback = function()
    {
        this.createBattlebackOg();
        this._back1Filter = new PIXI.Filter(undefined, shdBack1, {time: 0.0, amp: 5.0, freq: 10.0});
        this._back2Filter = new PIXI.Filter(undefined, shdVertOsc, {time: 0.0, amp: 30.0, freq: 8.0});
        this._back1Sprite.filters = [this._back1Filter];
        this._back2Sprite.filters = [this._back2Filter];
    };

    Spriteset_Battle.prototype.updateBattlebackOg = Spriteset_Battle.prototype.updateBattleback;
    Spriteset_Battle.prototype.updateBattleback = function()
    {
        this.updateBattlebackOg();
        this._back1Filter.uniforms.time += 0.01;
        this._back2Filter.uniforms.time += 0.01;
    };
})();
