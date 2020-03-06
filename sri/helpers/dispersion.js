module.exports = (elements, Mx) => {
  
  let temp = 0
  
  for(element of elements) {
    temp += (element - Mx) ** 2 
  }

  return temp / elements.length - 1
}