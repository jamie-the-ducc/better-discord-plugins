/**
 * @name SendBase64
 * @version 1.0.0b
 * @website https://github.com/jamie-the-ducc/better-discord-plugins/tree/main/SendBase64
 * @source https://raw.githubusercontent.com/jamie-the-ducc/better-discord-plugins/main/SendBase64/SendBase64.plugin.js
 * @updateUrl https://raw.githubusercontent.com/jamie-the-ducc/better-discord-plugins/main/SendBase64/SendBase64.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/
module.exports = (() => {
    const config = {
        info: {
            name: "SendBase64",
            authors: [{
                name: "Jam!3",
                discord_id: "604855154365300753",
                github_username: "jamie-the-ducc"
            }],
            version: "1.0.0b",
            description: "Messages will be automatically encoded with base64 encoding when sent",
            github: "https://github.com/jamie-the-ducc/better-discord-plugins/tree/main/SendBase64",
            github_raw: "https://raw.githubusercontent.com/jamie-the-ducc/better-discord-plugins/main/SendBase64/SendBase64.plugin.js"
        },
        changelog: [{
                title: "Initial Release",
                type: "added",
                items: ["Plugin by `[Jam!3]#4466`", "Messages will be automatically encoded with base64 encoding when sent", "**Check out my GitHub:**\nhttps://github.com/jamie-the-ducc/"]
            },
            {
                title: "Planned Features",
                type: "fixed",
                items: ["Button toggle [on/off]", "Include other encoding methods such as base16, base32, etc."]
            },
        ],
        main: "index.js"
    };

    return !global.ZeresPluginLibrary ? class {
        constructor() {
            this._config = config;
        }
        getName() {return config.info.name}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ")}
        getDescription() {return config.info.description}
        getVersion() {return config.info.version}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
            const {DiscordModules, Patcher} = Api;

            return class SendBase64 extends Plugin {
                constructor() {
                    super();
                }
                async onStart() {
                    Patcher.before(DiscordModules.MessageActions, "sendMessage", (_, [, msg]) => {
                        msg.content = window.btoa(unescape(encodeURIComponent(msg.content)));
                    });
                }
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/