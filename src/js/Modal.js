import API from "./API";

class Modal {
  constructor() {
    this.window = null;
  }

  close() {
    document.body.removeAttribute('style');
    this.window.remove();
    this.window = null;
  }

  onClickModal(e) {
    if (e.target === this.window) this.close();
  }

  create(content = '') {
    const wrapper = document.createElement('div');

    this.window = document.createElement('div');


    wrapper.className = 'modal__wrapper';

    if (typeof content === 'string' || typeof content === 'number') {
      wrapper.innerHTML = content;
    } else {
      wrapper.appendChild(content);
    }

    this.window.className = 'modal';
    this.window.appendChild(wrapper);
    this.window.addEventListener('click', e => this.onClickModal(e));


    document.body.style.overflow = 'hidden';
    document.body.prepend(this.window);
  }
}

export default Modal;
