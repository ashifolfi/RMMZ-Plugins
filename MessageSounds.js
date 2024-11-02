//=============================================================================
// RPG Maker MZ - Message Window Sounds
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [MZ] [Message]
 * @author Eden
 *
 * @help Adds sounds to text appearing in the message window.
 * In message events use \S[number] to select a sound effect. Setting the id to 0 will stop sounds from playing.
 * 
 * @param Sound Effects
 * @desc List of sound effects, the order is used to determine which id to use in messages.
 * @type file[]
 * @dir audio/se/
 * @default Default
 * 
 * @param Playback Frequency
 * @desc The amount of tics that should pass between each playback
 * @type number
 * @default 2
 * 
 * @param Minimum Pitch
 * @desc The low end of pitch variance
 * @type number
 * @default 80
 * 
 * @param Maximum Pitch
 * @desc The high end of pitch variance
 * @type number
 * @default 100
 */

const soundParams = PluginManager.parameters("MessageSounds");
soundParams["Sound Effects"] = JSON.parse(soundParams["Sound Effects"]);
soundParams["Minimum Pitch"] = Number(soundParams["Minimum Pitch"]);
soundParams["Maximum Pitch"] = Number(soundParams["Maximum Pitch"]);
soundParams["Playback Frequency"] = Number(soundParams["Playback Frequency"]);

function RandomRange(min, max)
{
    // stupid math that checks out
    return Math.floor(Math.random() * (max - min)) + min;
}

(function()
{
    Window_Message.prototype.clearFlags_orig = Window_Message.prototype.clearFlags;
    Window_Message.prototype.clearFlags = function()
    {
        this.clearFlags_orig();
        this._soundEffect = 0;
        this._soundWait = soundParams["Playback Frequency"];
    }

    Window_Message.prototype.processEscapeCharacter_orig = Window_Message.prototype.processEscapeCharacter;
    Window_Message.prototype.processEscapeCharacter = function(code, textState)
    {
        switch (code)
        {
            case "S":
                this.processSoundControl(this.obtainEscapeParam(textState));
                break;
            default:
                this.processEscapeCharacter_orig(code, textState);
                break;
        }
    };

    Window_Message.prototype.processSoundControl = function(id)
    {
        // get the sound effect from the list of sounds in properties
        this._soundEffect = id;
    };

    Window_Message.prototype.flushTextState_orig = Window_Message.prototype.flushTextState;
    Window_Message.prototype.flushTextState = function(textState)
    {
        this.flushTextState_orig(textState);
        if (this._soundEffect > 0)
        {
            if (this._soundWait > 0)
            {
                this._soundWait--;
            }
            else
            {
                AudioManager.playSe({
                    name: soundParams["Sound Effects"][this._soundEffect - 1],
                    volume: 100,
                    pitch: RandomRange(soundParams["Minimum Pitch"], soundParams["Maximum Pitch"])
                });
                this._soundWait = soundParams["Playback Frequency"];
            }
        }
    };
})();
