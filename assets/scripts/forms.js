import { 
  createEl,
  toClassName,
  readBlockConfig
} from './scripts.js';

function toggle(e) {
  const expanded = e.target.getAttribute('aria-expanded');
  if (expanded === 'true') {
    e.target.setAttribute('aria-expanded', false);
  } else {
    e.target.setAttribute('aria-expanded', true);
  }
}

export function getFields(fields) {
  let allFields = [];
  fields.forEach((f) => {
    switch (f) {
      case 'contact':
        allFields.push(
          { 
            data: { 
              store: true 
            }, 
            title: 'name', 
            type: 'text', 
            placeholder: 'your name', 
            required: true 
          },
          { 
            data: { 
              store: true 
            }, 
            title: 'cell', 
            type: 'tel', 
            placeholder: 'your cell', 
            required: true 
          },
          { 
            data: { 
              store: true 
            }, 
            title: 'email', 
            type: 'email', 
            placeholder: 'your email', 
            required: true 
          }
        );
        break;
      case 'address':
        allFields.push(
          { 
            data: { 
              fieldtype: 'address', 
              store: true 
            }, 
            title: 'addr1', 
            type: 'text', 
            placeholder: 'your address', 
            required: true 
          },
          { 
            data: { 
              fieldtype: 'address', store: true 
            }, 
            title: 'addr2', 
            type: 'text', 
            placeholder: 'apt # or building code? add here!' 
          },
          { 
            data: { 
              fieldtype: 'address', 
              store: true 
            }, 
            title: 'city', 
            type: 'text', 
            placeholder: 'your city', 
            required: true 
          },
          { 
            data: { 
              fieldtype: 'address', 
              store: true 
            }, 
            title: 'state', 
            type: 'text', 
            value: 'utah', 
            readonly: true 
          },
          { 
            data: { 
              fieldtype: 'address' 
            }, 
            title: 'zip', 
            type: 'select', 
            placeholder: 'your zip code', 
            src: 'deliveryZips', 
            required: true 
          }          
        );
        break;
      case 'address-national': 
        allFields.push(
          { 
            data: { 
              fieldtype: 'address', 
              store: true 
            }, 
            title: 'addr1', 
            type: 'text', 
            placeholder: 'your address', 
            required: true 
          },
          { 
            data: { 
              fieldtype: 'address', 
              store: true 
            }, 
            title: 'addr2', 
            type: 'text', 
            placeholder: 'apt # or building code? add here!' 
          },
          { 
            data: { 
              fieldtype: 'address', 
              store: true 
            }, 
            title: 'city', 
            type: 'text', 
            placeholder: 'your city', 
            required: true 
          },
          { 
            data: { 
              fieldtype: 'address', 
              store: true 
            }, 
            title: 'state', 
            type: 'text', 
            placeholder: 'your state', 
            required: true 
          },
          { 
            data: { 
              fieldtype: 'address', 
              store: true 
            }, 
            title: 'zip', 
            type: 'text', 
            placeholder: 'your zip code', 
            required: true 
          }
        )
        break;
      case 'pint-club':
        allFields.push(
          { 
            title: 'customize-pints', 
            type: 'checkbox', 
            label: 'customize your pints (select any that apply)', 
            src: 'packs', 
            options: [ 
              'keep it normal®', 
              'vegan', 
              'half-vegan', 
              'nut free', 
              'gluten free' 
            ] 
          },
          { 
            title: 'allergies', 
            type: 'text', 
            placeholder: 'any allergies? even shellfish, seriously! ya never know!' 
          },
          { 
            title: 'delivery-option', 
            type: 'radio', 
            label: 'how do you want to get your pints?', 
            options: [ 
              'pickup', 
              'shipping' 
            ], 
            required: true 
          }
        );
        break;
      case 'prepay-months': 
        allFields.push(
          { 
            title: 'prepay-months', 
            type: 'radio', 
            label: 'how many months?', 
            options: [ 
              '3', 
              '6', 
              '12' 
            ], 
            required: true 
          }
        );
        break;
      case 'merch':
        allFields.push(
          { 
            title: 'merch-checkout', 
            type: 'radio', 
            label: 'pick up/shipping', 
            options: [ 
              'in store pick up', 
              'ship in the mail' 
            ], 
            required: true 
          }
        );
        break;
      case 'pick-up':
        allFields.push(
          { 
            title: 'pickup-date', 
            type: 'text', 
            value: 'today', 
            readonly: true 
          },
          { 
            title: 'pickup-time', 
            type: 'select', 
            placeholder: 'select your pickup time', 
            src: 'hoursOfOp', 
            required: true 
          }
        )
        break;
      case 'discount-code':
        allFields.push(
          { 
            title: 'discount', 
            type: 'text', 
            placeholder: 'discount code' 
          }
        )
        break;
      case 'tip':
        allFields.push(
          { 
            title: 'tip', 
            type: 'select', 
            placeholder: 'no tip', 
            src: 'tipPercentages' 
          }
        )
        break;
      case 'payment-option':
        allFields.push(
          { 
            title: 'payment-option', 
            type: 'checkbox', 
            label: 'pay with gift card?', 
            options: [ 
              'pay with gift card?' 
            ]
          }
        )
        break;
      case 'cone-builder':
        allFields.push(
          { 
            title: 'flavor', 
            type: 'select', 
            placeholder: 'select your flavor', 
            src: 'coneBuilderFlavors' 
          },
          { 
            title: 'dip', 
            type: 'radio', 
            label: 'dip', 
            options: [ 
              'no dip' 
            ] 
          },
          { 
            title: 'toppings', 
            type: 'checkbox', 
            label: 'select topping (up to 3)', 
            options: [], 
            src: 'coneBuilderTopping' 
          }
        )
        break;
      case 'cone-builder-second-flavor':
        allFields.push(
          { 
            title: 'second-flavor', 
            type: 'select', 
            placeholder: 'select your second flavor', 
            src: 'coneBuilderFlavors' 
          }
        )
        break;
      case 'cone-builder-title':
        allFields.push(
          { 
            title: 'title', 
            type: 'text', 
            placeholder: 'name your creation', 
            required: true 
          }
        )
        break;
      default:
        console.error('hey normal, you tried to build a form with an invalid field:', f);
        break;
    }
  })
  return allFields;
}

export function buildFields(field) {
  let fieldEl;

  if (field.type === 'radio' || field.type === 'checkbox') {
    //setup options
    fieldEl = createEl('div', {
      class: `form-${field.type}`,
      id: `${field.type}-${toClassName(field.title)}`
    });

    const expanded = field.required || false;
    const title = createEl('h3', {
      role: 'button',
      'aria-expanded': expanded,
      // 'aria-controls': toClassName(q.textContent)
    });
    title.textContent = field.label;
    title.addEventListener('click', toggle);

    fieldEl.append(title); 

    const optionsContainer = createEl('div', {
      class: `form-${field.type}-container`,
      'aria-expanded': false
    });
    
    field.options.forEach((o) => {
      const label = createEl('label', {
        class: `form-${field.type}-option`,
        for: toClassName(o)
      });
      label.textContent = o;

      const bubble = createEl('span', {
        class: `form-${field.type}-bubble`
      });

      const option = createEl('input', {
        class: `form-${field.type}-default`,
        id: toClassName(o),
        name: field.title,
        type: field.type
      });
      option.value = o;
      
      label.append(option, bubble);      
      optionsContainer.append(label);
    });

    fieldEl.append(optionsContainer);
  } 
  else if (field.type === 'select') {
    fieldEl = createEl('div', {
      class: 'form-select-wrapper'
    });
    // data attributes
    if (field.data) {
      for (dataType in field.data) {
        fieldEl.setAttribute(`data-${dataType}`, field.data[dataType]);
      }
    }
    const select = createEl(field.type, {
      class: 'form-select',
      id: toClassName(field.title),
      name: toClassName(field.title)
    });

    const option = createEl('option');
    option.textContent = field.placeholder;
    option.value = '';
    option.disabled = true;
    option.selected = true;
    option.hidden = true;

    select.append(option);
    fieldEl.append(select);
  } else {
    fieldEl = createEl('input', {
      class: 'form-field',
      id: toClassName(field.title),
      name: toClassName(field.title),
      type: field.type || 'text'
    });
    // input patterns
    if (field.type === 'tel') {
      fieldEl.pattern = '[0-9]{10,11}';
    } else if (field.type === 'email') {
      fieldEl.pattern = '[a-zA-Z0-9\\.]+@[a-zA-Z0-9]+(\\.[a-zA-Z0-9]+)+';
    } else if (field.title === 'zip') {
      fieldEl.pattern = '[0-9]{5}(?:-[0-9]{4})?';
    }
    // placeholder
    if (field.placeholder) {
      fieldEl.placeholder = field.placeholder;
    }
    // default value
    if (field.value) {
      fieldEl.value = field.value;
    }
    // data params
    if (field.data) {
      for (dataType in field.data) {
        fieldEl.setAttribute(`data-${dataType}`, field.data[dataType]);
      }
    }
    // required
    if (field.required) {
      fieldEl.required = field.required;
    }
    // readonly
    if (field.readonly) {
      fieldEl.readOnly = field.readonly;
    }
  }

  return fieldEl;
}

export function populateOptions(el, data) {
  data.forEach((d) => {
    const option = createEl('option');
    option.value = d.value || d;
    option.textContent = d.text || d;
    el.append(option);
  });
}
