//=============================================================================
// RPG Maker MZ - Undertale Menu
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [MZ] [ProjectRed] [Menu]
 * @author Eden
 * @url https://github.com/ashifolfi/RMMZ-Plugins
 *
 * @help Replaces the menu with an Undertale style menu
 */

(function()
{
    Scene_Menu.prototype.create = function()
    {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();

        // Undertale status menu
        this.createGoldWindow();

        // don't create the other windows, we don't use them.
    };

    Scene_Menu.prototype.createCommandWindow = function()
    {
        const rect = new Rectangle(16, 160, 172, 240);
        const commandWindow = new Window_MenuCommand(rect);
        commandWindow.setHandler("item", this.commandItem.bind(this));
        commandWindow.setHandler("status", this.commandPersonal.bind(this));
        commandWindow.setHandler("cell", this.commandFormation.bind(this));
        commandWindow.setHandler("options", this.commandOptions.bind(this));
        commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
        commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(commandWindow);
        this._commandWindow = commandWindow;
    };

    Scene_Menu.prototype.start = function()
    {
        Scene_MenuBase.prototype.start.call(this);
        // don't refresh status window! it doesn't exist!
    };
    
    Scene_Menu.prototype.goldWindowRect = function()
    {
        return new Rectangle(16, 16, 172, 140);
    };

    Window_MenuCommand.prototype.makeCommandList = function()
    {
        // todo: translations
        this.addCommand("ITEM", "item", true);
        this.addCommand("STAT", "status", true);
        this.addCommand("CELL", "cell", true);
        this.addCommand("CONF", "options", true);
        this.addCommand("QUIT", "gameEnd", true);
    };
})();
