$(function() {
	const storage = window.localStorage;

	const init = {
		scale: 0.5,
		thinkness: 0.2,
		color: 1,
		style: false,
		source: '111\n222\n333'
	}

	const dest = $('#dest');

	const update = function() {
		const source = $('#source').val();

		dest.empty();

		$.each(source.replace(/[^0-9 \n]/, '').split('\n'), function(index, text) {
			const y = index * 60;

			for (let pos = 0; pos < text.length; ++pos) {
				const ch = text.charAt(pos);
				
				if (/\d/.test(ch)) {
					const elem = document.createElementNS('http://www.w3.org/2000/svg', 'use');
					elem.setAttributeNS(null, 'href', 'digit.svg#d' + ch);
					elem.setAttributeNS(null, 'width', '60');
					elem.setAttributeNS(null, 'height', '60');
					elem.setAttributeNS(null, 'x', pos * 60);
					elem.setAttributeNS(null, 'y', y);

					if (pos == 0) {
						elem.setAttributeNS(null, 'stroke', 'red');
						elem.setAttributeNS(null, 'stroke-width', '.5');
						elem.setAttributeNS(null, 'stroke-dasharray', 'none');
					}

					dest.append(elem);
				}
			}
		});

		storage.setItem('source', source);
	};


	$('#panel').tabs();

	const scale = $('#scale').slider({ min: 0.3, max: 1.0, step: 0.01 })
		.on('slidechange slide', function(event, ui) {
			const val = ui.value || scale.slider('value');

			dest.attr('transform', `scale(${val} ${val})`);
			$('#bge').attr('patternTransform', `scale(${val} ${val})`);

			storage.setItem('scale', val);
		});

	const thinkness = $('#thinkness').slider({ min: 0.1, max: 0.7, step: 0.01 })
		.on('slidechange slide', function(event, ui) {
			const val = ui.value || thinkness.slider('value');

			dest.attr('stroke-width', val);

			storage.setItem('thinkness', val);
		});

	const color = $('#color').slider({ min: 0, max: 1, step: 0.01 })
		.on('slidechange slide', function(event, ui) {
			const val = ui.value || color.slider('value');

			dest.attr('stroke', `rgba(0,0,0,${val})`);

			storage.setItem('color', val);
		});

	const style = $('#style')
		.on('click change', function() {
			const val = style.prop('checked');

			if (val)
				dest.each(function() { this.setAttributeNS(null, 'stroke-dasharray', '1 1.5'); });
			else
				dest.each(function() { this.removeAttributeNS(null, 'stroke-dasharray'); });

			storage.setItem('style', val);
		});

	$('#source').on('keydown change', function() {
		setTimeout(update, 0);
	});

	$('.inject').each(function() {
		const elem = $(this);
		const name = elem.attr('id');
		const value = storage.getItem(name) || init[name];

		if (elem.is('.ui-slider'))
			elem.slider('value', value);
		else if (elem.is(':checkbox'))
			elem.prop('checked', value === 'true');
		else
			elem.val(value);

		elem.trigger('change');
	});
});
