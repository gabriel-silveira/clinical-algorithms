function updateSelectBoxAndSelectedItem(element: Element) {
  /* When an item is clicked, update the original select box, and the selected item: */
  let y;
  let index;
  let k;
  let yl;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const s = element.parentNode.parentNode.getElementsByTagName('select')[0];
  const sl = s.length;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const h = element.parentNode.previousSibling;

  if (h) {
    for (index = 0; index < sl; index += 1) {
      if (s.options[index].innerHTML === element.innerHTML) {
        s.selectedIndex = index;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        h.innerHTML = element.innerHTML;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        y = element.parentNode.getElementsByClassName('same-as-selected');
        yl = y.length;

        for (k = 0; k < yl; k += 1) {
          y[k].removeAttribute('class');
        }

        element.setAttribute('class', 'same-as-selected');
        break;
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    h.click();
  }
}

/*
function closeAllSelect(element: Element) {
  // A function that will close all select boxes in the document,
  // except the current select box:
  let i;
  const arrNo = [];

  const selectItems = document.getElementsByClassName('select-items');
  const xl = selectItems.length;

  const selectSelected = document.getElementsByClassName('select-selected');
  const yl = selectSelected.length;

  for (i = 0; i < yl; i += 1) {
    if (element === selectSelected[i]) {
      arrNo.push(i);
    } else {
      selectSelected[i].classList.remove('select-arrow-active');
    }
  }

  for (i = 0; i < xl; i += 1) {
    if (arrNo.indexOf(i)) {
      selectItems[i].classList.add('select-hide');
    }
  }
}

function closeOtherSelects(e: PointerEvent) {
  // When the select box is clicked, close any other select boxes,
  // and open/close the current select box:
  e.stopPropagation();

  // closeAllSelect(this);

  this.nextSibling.classList.toggle('select-hide');
  this.classList.toggle('select-arrow-active');
}
*/

/* If the user clicks anywhere outside the select box, then close all select boxes: */
// document.addEventListener('click', closeAllSelect);

let selectedItem: object | null = null;

export const CustomSelect = {
  get selectedItem() {
    return selectedItem;
  },
  init(customSelectId: string, label: string) {
    const customSelect = document.getElementById(customSelectId);

    if (customSelect) {
      const selectElement = customSelect.getElementsByTagName('select')[0];

      const totalOptions = selectElement.length;

      /* For each element, create a new DIV that will act as the selected item: */
      const a = document.createElement('div');
      a.setAttribute('class', 'select-selected');
      a.innerHTML = selectElement.options[selectElement.selectedIndex]?.innerHTML || label;

      customSelect.appendChild(a);

      /* For each element, create a new DIV that will contain the option list: */
      const b = document.createElement('div');
      b.setAttribute('class', 'select-items select-hide');

      for (let j = 0; j < totalOptions; j += 1) {
        // For each option in the original select element,
        // create a new DIV that will act as an option item:
        const c = document.createElement('DIV');
        c.innerHTML = selectElement.options[j].innerHTML;
        c.setAttribute('data-value', selectElement.options[j].value);

        // eslint-disable-next-line no-loop-func
        c.addEventListener('click', () => {
          // selected item on a private variable
          selectedItem = {
            id: c.getAttribute('data-value'),
            value: c.innerHTML,
          };

          a.innerHTML = c.innerHTML;

          this.onSelectCallback();
        });

        b.appendChild(c);
      }

      customSelect.appendChild(b);

      a.addEventListener('click', (e: MouseEvent) => {
        // When the select box is clicked, close any other select boxes,
        // and open/close the current select box:
        e.stopPropagation();

        b.classList.toggle('select-hide');

        a.classList.toggle('select-arrow-active');
      });

      document.addEventListener('click', () => {
        b.classList.add('select-hide');

        a.classList.remove('select-arrow-active');
      });
    }
  },
  onSelectCallback: () => ({}),
  onSelect(callback: () => object) {
    this.onSelectCallback = callback;
  },
};
