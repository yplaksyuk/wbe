import * as symbols from './symbols.js';

$(function() {
	const config = { };

	const dest = $('#dest');

	const font = Object.assign({ }, symbols.digits, symbols.printed, symbols.special);

	const update = function() {
		const source = $('#source').val();
		const thinkness = $('#thinkness').val();
		const is_monospaced = $('#monospaced').prop('checked');
		const is_fragment = $('#fragment').prop('checked');
		const repeat = + $('#repeat').val();

		const default_style = $('#dashed').prop('checked') ? 'dashed' : 'normal';

		let j = 0;

		if ($('#sample').prop('checked')) {
			const ch = source.trim().charAt(0).toUpperCase();
			const src = symbols.samples[ch];

			if (src) {
				$('#sampleDrawing').attr('href', src);
				$('#sampleDrawing').show();
				j = 3;
			}
			else
				$('#sampleDrawing').hide();
		}
		else
			$('#sampleDrawing').hide();

		const appendSymbol = function(spec, pos, style) {
			if (spec) {
				const x = pos.x + (config.monospaced ? (12 - spec.width) / 2 : - (spec.kern || 0));
				const y = pos.y + 0.25;

				const elem = document.createElementNS('http://www.w3.org/2000/svg', 'use');
				elem.setAttributeNS(null, 'href', spec.href);
				elem.setAttributeNS(null, 'width', '24');
				elem.setAttributeNS(null, 'height', '24');
				elem.setAttributeNS(null, 'x', x);
				elem.setAttributeNS(null, 'y', y);

				switch (style) {
				case 'red':
					elem.setAttributeNS(null, 'stroke', 'red');
					elem.setAttributeNS(null, 'stroke-width', '.5');
					break;
				case 'dashed':
					elem.setAttributeNS(null, 'stroke-dasharray', `${thinkness},${thinkness * 3}`);
				}

				dest.append(elem);

				if (0) {
					const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					rect.setAttributeNS(null, 'width',spec.width);
					rect.setAttributeNS(null, 'height', 11);
					rect.setAttributeNS(null, 'x', x);
					rect.setAttributeNS(null, 'y', y);
					rect.setAttributeNS(null, 'stroke', 'green');
					rect.setAttributeNS(null, 'stroke-width', .1);
					rect.setAttributeNS(null, 'fill-opacity', 0);
					dest.append(rect);
				}

				pos.x += config.monospaced ? 12 : spec.width - (spec.kern || 0);
			}
		};

		let fragment = [];
		let fragment_open = false;

		const appendLine = function(text, recursive) {
			const pos = { x: 0, y: j++ * 12 };

			let fragment_appended = false;

			const append_fragment = function(){
				if (fragment_open && !recursive) {
					fragment_appended || fragment.push(text);
					fragment_appended = true;
				}
			};

			append_fragment();

			for (let i = 0; i < text.length; ++i) {
				const ch0 = text.charAt(i);
				if (ch0 == '[' || ch0 == ']') {
					if (is_fragment) {
						fragment_open = ch0 == '[';
						append_fragment();
					}

				}
				else {
					const ch1 = text.charAt(i + 1);
					const style = config.cap && i == 0 ? 'red' : default_style;

					const spec = font[ch0] && (is_monospaced || ch1 === ' ' || ch1 === '' ? font[ch0].b : font[ch0].c || font[ch0].b);
					appendSymbol(spec, pos, fragment_open ? (recursive ? 'dashed' : 'red') : style);
				}
			}

			if (!fragment_open && fragment.length > 0) {
				const arr = fragment; fragment = [];

				for (let n = 0; n < repeat; ++n)
					$.each(arr, function(k, text) { appendLine(text, true); });
			}
		};


		dest.empty();

		$.each(source.split('\n'), function(k, text) { appendLine(text); });
	};


	$('#panel').tabs();

	const background = $('#background')
		.on('change', function() {
			const val = background.val();
			$('#backgroundRect').attr('style', `fill: url(#${val})`);
		});

	const scale = $('#scale').on('change input', function() {
		const val = $(this).val();

		dest.attr('transform', `scale(${val} ${val})`);
		$('.backgroundPattern').attr('patternTransform', `scale(${val} ${val})`);
	});

	const thinkness = $('#thinkness').on('change input', function() {
		const val = $(this).val();
		dest.attr('stroke-width', val);
	});

	const color = $('#color').on('change input', function() {
		const val = 255 - $(this).val();
		dest.attr('stroke', `rgb(${val}, ${val},${val})`);
	});

	const cursive = $('#cursive')
		.on('click change', function() {
			Object.assign(font,  cursive.prop('checked') ? symbols.cursive : symbols.printed );
		});

	const border = $('#border')
		.on('click change', function() {
			$('#borderLine').toggle(border.prop('checked'));
		});

	// --

	const storage = window.localStorage;
	$('.inject')
		.on('change input', function() {
			setTimeout(update, 0);

			const elem = $(this);
			const name = elem.attr('id');

			const setValue = function(val) {
				storage.setItem(name, config[name] = val);
			};

			if (elem.is(':checkbox'))
				setValue(elem.prop('checked'));
			else
				setValue(elem.val());
		})
		.each(function() {
			const elem = $(this);
			const name = elem.attr('id');

			const value = storage.getItem(name);
			if (value != null) {
				if (elem.is(':checkbox'))
					elem.prop('checked', value === 'true');
				else
					elem.val(value);

				elem.trigger('change');
			}
		});
});
