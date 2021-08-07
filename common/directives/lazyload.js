export default {
  inserted: el => {
    function loadImage() {
      el.src = el.dataset.src
    }

    var callback = function (entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage()
          observer.observe(el);
        }
      })
    }

   function crateIntersectionObserver(){
      const options = {
        root: null,
        threshold: 0
    }

    const observer = new IntersectionObserver(callback, options)
    observer.observe(el);

    }

    if (!window['IntersectionObserver']) {
      loadImage()
    }else{
      crateIntersectionObserver()
    }

  }

}
