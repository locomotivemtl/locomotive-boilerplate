export function transform(el, transformValue){
    el.style.webkitTransform = transformValue;
    el.style.msTransform = transformValue;
    el.style.transform = transformValue;
}
