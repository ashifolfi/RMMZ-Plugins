//=============================================================================
// RPG Maker MZ - BMFont Drawer
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [MZ] [BMFont Support]
 * @author Eden
 *
 * @help
 * This plugin adds support for text format BMFont fonts
 * for bitmap font drawing.
 * 
 * Currently Supports:
 * - Basic text drawing in all scenes and windows
 * 
 * WIP/Broken:
 * - Colors
 * - Size changing
 */

function BMFont() {
	throw new Error("This is a static class");
}

(function() {
	BMFont.getChar = function(font, code)
	{
		for (let i = 0; i < font.chars._count; i++)
		{
			if (font.chars.char[i]._id == code)
			{
				return font.chars.char[i];
			}
		}
		return null;
	};

	FontManager.BMFontCache = {};
	
	FontManager.loadOrig = FontManager.load;
	FontManager.load = function(family, filename)
	{
		if (filename.endsWith(".fnt"))
		{
			// this is a BMFont file in json format
			const xhr = new XMLHttpRequest();
			const url = "fonts/" + filename;
			this.BMFontCache[family] = null;
			xhr.open("GET", url);
			xhr.overrideMimeType("application/json");
			xhr.onload = () => this.bmOnXhrLoad(xhr, family, filename, url);
			xhr.onerror = () => this.onXhrError(family, filename, url);
			xhr.send();
		}
		else
		{
			// this is not a BMFont file
			this.loadOrig(family, filename);
		}
	};
	
	FontManager.bmOnXhrLoad = function(xhr, name, src, url)
	{
		if (xhr.status < 400)
		{
			this.BMFontCache[name] = JSON.parse(xhr.responseText);

			// load pages into memory
			this.BMFontCache[name].font.pageBMP = [];
			for (let i = 0; i < this.BMFontCache[name].font.pages._count; i++)
			{
				const pageInf = this.BMFontCache[name].font.pages.page[i];
				this.BMFontCache[name].font.pageBMP[pageInf._id] = ImageManager.loadBitmap("fonts/", pageInf._file);
			}
		}
		else
		{
			this.onXhrError(name, src, url);
		}
	};

	FontManager.onXhrError = function(name, src, url)
	{
		const error = { name: name, src: src, url: url };
		this._errors.push(error);
	};

	Bitmap.prototype.measureTextWidthOrig = Bitmap.prototype.measureTextWidth;
	Bitmap.prototype.measureTextWidth = function(text)
	{
		// check the font face cache in BMFontCache
		const fonts = this.fontFace.split(", ");
		for (const fontFace in fonts)
		{
			if (FontManager.BMFontCache[fonts[fontFace]] != null)
			{
				const font = FontManager.BMFontCache[fonts[fontFace]].font;
				
				let width = 0;

				let x_off = 0;
				let y_off = 0;
				for (let i = 0; i < text.length; i++)
				{
					if (text[i] == "\n")
					{
						x_off = 0;
						y_off += lineHeight;
						continue;
					}

					let char = BMFont.getChar(font, text.charCodeAt(i));
					if (char != null)
					{
						x_off += Number(char._width);
					}

					if (x_off > width)
					{
						width = x_off;
					}
				}
				
				return width;
			}

			// if the font is loaded as a non BMP then draw it
			if (FontManager._states[fonts[fontFace]] == "loaded")
			{
				break;
			}
		}
		return this.measureTextWidthOrig(text);
	};
	
	Bitmap.prototype.drawTextOrig = Bitmap.prototype.drawText;
	Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align)
	{
		// check the font face cache in BMFontCache
		const fonts = this.fontFace.split(", ");
		for (const fontFace in fonts)
		{
			if (FontManager.BMFontCache[fonts[fontFace]] != null)
			{
				this.drawBMText(FontManager.BMFontCache[fonts[fontFace]].font, text, x, y, maxWidth, lineHeight, align);
				return;
			}

			// if the font is loaded as a non BMP then draw it
			if (FontManager._states[fonts[fontFace]] == "loaded")
			{
				break;
			}
		}
		this.drawTextOrig(text, x, y, maxWidth, lineHeight, align);
	};
	
	Bitmap.prototype.drawBMText = function(font, text, x, y, maxWidth, lineHeight, align)
	{
		maxWidth = maxWidth || 0xffffffff;
		let tx = x;
		if (align === "center") {
			tx += maxWidth / 2;
		}
		if (align === "right") {
			tx += maxWidth;
		}

		let y_off = 0;
		let lines = text.split("\n");
		for (const idx in lines)
		{
			let width = this.measureTextWidth(lines[idx]);
			
			let x_off = 0;
			if (align == "center")
			{
				x_off -= width / 2;
			}
			else if (align == "right")
			{
				x_off -= width;
			}

			for (let i = 0; i < lines[idx].length; i++)
			{
				let char = BMFont.getChar(font, lines[idx].charCodeAt(i));
				if (char != null)
				{
					// this exists within the font
					// cursed drawing method
					this.blt(
						font.pageBMP[char._page],
						char._x, char._y, char._width, char._height,
						tx + x_off + Number(char._xoffset),
						y + y_off + Number(char._yoffset)
					);

					x_off += Number(char._width);
				}
			}
			y_off += lineHeight;
		}
	};
})();
