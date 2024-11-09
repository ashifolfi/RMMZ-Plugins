/*:
 * @target MZ
 * @plugindesc [MZ] [Input]
 * @author Eden
 * 
 * @help Disables touch/mouse inputs in most places
 * @url https://github.com/ashifolfi/RMMZ-Plugins
 */

(function()
{
    TouchInput._setupEventHandlers = function() {}
    document.body.style.cursor = 'none';
})();
