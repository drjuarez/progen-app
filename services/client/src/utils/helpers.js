import deepmerge from 'deepmerge';

export default {
  traverseDomTree(initialNode, callBack) {
    const traverse = (nextNode) => {
      if(typeof(nextNode)!=='object') return;
      const childNodes = nextNode['props']['children'];
      const isChildNodesAnArray = Array.isArray(childNodes);
      if(isChildNodesAnArray) {
        childNodes.forEach(child => traverse(child));
      } else if (childNodes !== undefined) {
        traverse(childNodes);
      } else {
        callBack(nextNode);
      }
    };

    traverse(initialNode);
  },


  deepMergeOverwrite(first, second) {
    const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;
    return deepmerge(first, second, {arrayMerge: overwriteMerge});
  },


  // updateOrder(items, idProperty, changedId, newOrder) {
  //   items.forEach((item, i) => item.order = i);
  //   const changedItem = items.find(item => item[idProperty] === changedId);
  //   const isItemHigherOrder = newOrder < changedItem.order;
  //   const oldSortOrder = changedItem.order;
  //   changedItem.order = newOrder;
  //   if(isItemHigherOrder) {
  //     items = items.map(item => {
  //       if(item[idProperty] !== changedItem[idProperty] &&
  //         item.order >= newOrder &&
  //         item.order <= oldSortOrder) {
  //           item.order +=1;
  //       }
  //       return item;
  //     });
  //   } else {
  //     items = items.map(item => {
  //       if(item[idProperty] !== changedItem[idProperty] &&
  //         item.order <= newOrder &&
  //         item.order >= oldSortOrder) {
  //           item.order -=1;
  //       }
  //       return item;
  //     });
  //   }
  //   this.sortBy(items, 'order');
  //   items.forEach((item, i) => delete item.order);
  //   return items;
  // },

  updateOrder(items, idProperty, changedId, orderProperty, newOrder) {
    const changedItem = items.find(item => item[idProperty] === changedId);
    const isItemHigherOrder = newOrder < changedItem[orderProperty];
    const oldSortOrder = changedItem[orderProperty];
    changedItem[orderProperty] = newOrder;
    if(isItemHigherOrder) {
      items = items.map(item => {
        if(item[idProperty] !== changedItem[idProperty] &&
          item[orderProperty] >= newOrder &&
          item[orderProperty] <= oldSortOrder) {
            item[orderProperty] +=1;
        }
        return item;
      });
    } else {
      items = items.map(item => {
        if(item[idProperty] !== changedItem[idProperty] &&
          item[orderProperty] <= newOrder &&
          item[orderProperty] >= oldSortOrder) {
            item[orderProperty] -=1;
        }
        return item;
      });
    }
    return items;
  },


  getCroppedImage(image, pixelCrop, fileName) {
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // As Base64 string
    // const base64Image = canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(file => {
        file.name = fileName;
        resolve(file);
      }, 'image/png');
    });
  },


  sortBy(thingToSort, sortBy, order='asc') {
    return thingToSort.sort((a,b) => {
      if(order === 'asc') {
        return a[sortBy] - b[sortBy];
      }
      else {
        return b[sortBy] - a[sortBy];
      }
    });
  },


  sleep(callback, duration) {
    return new Promise(resolve => {
      setTimeout(()=>resolve(callback()), duration);
    });
  },


  toPercent(number, precision=2) {
    if(typeof(number) === 'string') {
      number = parseFloat(number);
    }
    return Math.round(number * 100, precision) + '%';
  },


  formatDate(date) {
    return `${date.month}/${date.day}/${date.year}`;
  },


  getUnique(stuff) {
    let callBack = (accumulator, currentValue) => {
      if (!accumulator.viewedIds[currentValue.id]) {
        accumulator.viewedIds[currentValue.id] = true;
        accumulator.savedItems.push(currentValue);
        return accumulator;
      }

      return accumulator;
    };

    let processed = stuff.reduce(callBack, {viewedIds: {}, savedItems: []});
    return processed.savedItems;
  }
};
