const ll = document.querySelector('#ll'),
	link = document.querySelector('#link'),
	ports = document.querySelector('#ports'),
	baud = document.querySelector('#baud'),
	stat = document.querySelector('.fa-server'),
	stat1 = document.querySelector('.fa-microchip'),
	stat2 = document.querySelector('.fa-gamepad'),
	server = 'http://10.42.0.1:3000/'

let fetchable = false,
	linkable = false

onload = () => {
	setInterval(() => {
		fetch(server + 'status').then(res => {
			if (res.status === 200) {
				stat.classList.remove('fail')
				stat.classList.add('success')
				fetchable = true
			}
		}).catch(err => {
			stat.classList.remove('success')
			stat.classList.add('fail')
			fetchable = false
		})
	}, 2000)
}

ll.addEventListener('click', () => {
	if (fetchable === false) return
	fetch(server + 'available').then(res => res.json()).then(data => {
		let portsArr = data.stdout.split('\n').slice(0, -1),
			selector = document.querySelector('#device')

		link.classList.remove('blink')
		if (document.querySelector('.select-port'))
			document.querySelector('.select-port').remove()
		if (document.querySelector('.select-baud'))
			document.querySelector('.select-baud').remove()
		if (document.querySelector('.port-items'))
			document.querySelector('.port-items').remove()
		if (document.querySelector('.baud-items'))
			document.querySelector('.baud-items').remove()
		if (portsArr.length > 0) {
			ports.disabled = false
			ll.classList.remove('blink')
			ports.innerHTML = portsArr.map(port => `<option value="${port.slice(0, port.indexOf(' '))}">${port}</option>`).join('')
			ports.selectedIndex = 0
			baud.disabled = false
			baud.selectedIndex = 0
			
			for(var i = 0; i < 2; i++) {
				var selected = undefined,
					a = document.createElement('div'),
					b = document.createElement('div')
				if (i === 1)
					selected = document.querySelector('#baud')
				else
					selected = document.querySelector('#ports')
				a.setAttribute('class', i === 0 ? 'select-port' : 'select-baud')
				a.innerHTML = selected.options[selected.selectedIndex].innerHTML
				selector.appendChild(a)
				b.setAttribute('class', i === 0 ? 'port-items select-hide' : 'baud-items select-hide')
					for(var j = 0; j < selected.length; j++) {
						var c = document.createElement('div')
						c.innerHTML = selected.options[j].innerHTML
						c.addEventListener('click', function() {
							var y, i, k, s, h
							link.disabled = false
							link.classList.add('blink')
							for(i = 0; i < this.parentNode.parentNode.getElementsByTagName('select')[0].length; i++) {
								if(this.innerHTML === this.parentNode.parentNode.getElementsByTagName('select')[0].options[i].innerHTML) {
									s = this.parentNode.parentNode.getElementsByTagName('select')[0]
									break
								}
							}
							for(i = 0; i < this.parentNode.parentNode.getElementsByTagName('select')[1].length; i++) {
								if(this.innerHTML === this.parentNode.parentNode.getElementsByTagName('select')[1].options[i].innerHTML) {
									s = this.parentNode.parentNode.getElementsByTagName('select')[1]
									break
								}
							}
							h = this.parentNode.previousSibling
							for(i = 0; i < s.length; i++) {
								s.selectedIndex = i
								h.innerHTML = this.innerHTML
								for(k = 0; k < this.parentNode.getElementsByClassName('same-as-selected').length; k++) {
									this.parentNode.getElementsByClassName('same-as-selected')[k].removeAttribute('class')
								}
								if(h.classList.contains('select-port'))
									ports.selectedIndex = i
								else
									baud.selectedIndex = i
								for(k = 0; k < s.length; k++) {
							
									s[k].removeAttribute('class')
									this.setAttribute('class', 'same-as-selected')
									if (s.id === 'ports')
										s.value = this.innerHTML.slice(0, this.innerHTML.indexOf(' '))
									else
										s.value = this.innerHTML
									break
								}
							}
							h.click()
						})
						b.appendChild(c)
					}
					selector.appendChild(b)
					a.addEventListener('click', function(e) {
						e.stopPropagation()
						closeAllSelect(this)
						this.nextSibling.classList.toggle('select-hide')
						this.classList.toggle('select-arrow-active')
					})
			}
		}	else {
			ll.classList.add('blink')
			link.disabled = true
			ports.disabled = true
			baud.disabled = true
			ports.innerHTML = '<option value="0">No hay puertos disponibles</option>'
		}
	})
})

function closeAllSelect(elmnt) {
	var x, y, i, arrNo = []
	x = document.getElementsByClassName('select-items')
	y = document.getElementsByClassName('select-selected')
	for(i = 0; i < y.length; i++) {
		if(elmnt === y[i]) {
			arrNo.push(i)
		} else {
			y[i].classList.remove('select-arrow-active')
		}
	}
	for(i = 0; i < x.length; i++) {
		if(arrNo.indexOf(i)) {
			x[i].classList.add('select-hide')
		}
	}
}

link.addEventListener('click', () => {
	var lastUpdates = undefined
	if (fetchable === false) return
	if (ports.value === '0') return
	linkable = !linkable
	if (linkable === true) {
		fetch(server + 'config', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				port: ports.value,
				baudrate: baud.value
			})
		}).then(res => {
			if (res.status === 200) {
				link.classList.remove('blink')
				stat1.classList.remove('fail')
				stat1.classList.add('success')
				ports.disabled = true
				baud.disabled = true
				lastUpdates = setInterval(() => {
					if (linkable === false) {
						clearInterval(lastUpdates)
						return
					}
					fetch(server + 'robot').then(res => res.json()).then(data => {
						var keys = Object.keys(data)
						keys.forEach(key => {
							document.getElementById(key).innerText = data[key]
						})
					})
				}, 500)
			}
			else {
				stat1.classList.add('fail')
				stat1.classList.remove('success')
				clearInterval(lastUpdates)
				
			}
		})
	}
	else {
		fetch(server + 'close').then(res => {
			if (res.status === 200) {
				link.classList.remove('blink')
				stat1.classList.remove('success')
				stat1.classList.add('fail')
				ports.disabled = false
				baud.disabled = false
				clearInterval(lastUpdates)
			}
		})
	}
})
