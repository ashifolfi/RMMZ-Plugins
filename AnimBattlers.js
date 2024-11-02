//=============================================================================
// RPG Maker MZ - MV Animation Battlers
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [MZ] [Battle]
 * @author Eden
 * @url https://github.com/ashifolfi/RMMZ-Plugins
 *
 * @help
 * Uses MV Style Animations for battlers instead of normal battler graphics.
 * To set an animation for a battler, put <AnimIdle:[id]> in the note section.
 */

(function() {
    Sprite_Enemy.prototype.updateBitmap_orig = Sprite_Enemy.prototype.updateBitmap;
    Sprite_Enemy.prototype.updateBitmap = function()
    {
        this.updateBitmap_orig();

        if (this._mainAnim == null)
        {
            const animId = $dataEnemies[this._enemy.enemyId()].meta.AnimIdle;

            this._mainAnim = new Sprite_AnimationMV();
            this._mainAnim.setup([this], $dataAnimations[animId], false, 0);
            this.parent.addChild(this._mainAnim);
        }
    };

    Sprite_Enemy.prototype.update_orig = Sprite_Enemy.prototype.update;
    Sprite_Enemy.prototype.update = function()
    {
        this.update_orig();
        this._mainAnim.update();
        if (!this._mainAnim.isPlaying())
        {
            // call these again to loop the animation
            this._mainAnim.setupRate();
            this._mainAnim.setupDuration();
        }
    };
})();
