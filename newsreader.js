//==================================
// NEWS READER
//==================================
/*
Composite pattern is used for this solution

To extend the code with new type like hastag, 
we will have to create a method name called 
hashtagFormatter that will consume the factory 
function 'formatterInterface' using function composition. 
Then we will have to add the mapping type in the constant 
formatterMapping


Output formats considered:

Module 1:
=========

Module one output is considered to be in the string format

Module 2:
=========

Module two output is in the format of array of objects.
Object's format will be as follows
{
  startIndex,
  endIndex,
  type
}
*/


/**
 * 
 * @param {object} props 
 * Mimicing interface implementation in JS to make sure that all the types(like entity, link, twitterUsername) has the format method.
 */
const formatterInterface = (props) => ({
  type: 'formatInterface',
  format: () => props.format(props)
});

/**
* 
* @param {object} props 
* This method is used to generate the composite object.
*/
const getCompositeObj = (props) => {
  const interfaceObj = formatterInterface(props);
  return Object.create(interfaceObj);
};

/**
* 
* @param {string} entity 
* This method is used to format the entity type.
*/
const entityFormatter = (entity) => {
  const props = {
      entity,
      format: (props) => `<strong>${props.entity}</strong>`
  };
  return Object.assign(getCompositeObj(props), {
      entity
  })
}

/**
* 
* @param {string} link 
* This method is used to format the link type.
*/
const linkFormatter = (link) => {
  const props = {
      link,
      format: (props) => `<a href="${props.link}">${props.link}</a>`
  };
  return Object.assign(getCompositeObj(props), {
      link
  })
}

/**
* 
* @param {string} userName 
* This method is used to format the twitter username type.
*/
const twitterUsernameFormatter = (userName) => {
  const props = {
      userName,
      format: (props) => {
          const {
              userName
          } = props;
          return `${userName[0]}<a href="https://twitter.com/${userName.substring(1)}">${userName.substring(1)}</a>`
      }
  };
  return Object.assign(getCompositeObj(props), {
      userName
  })
}

/**
* 
* @param {string} hashTag 
* This method is used to format the twitter hashtag type.
*/
const twitterHashtagFormatter = (hashTag) => {
  const props = {
      hashTag,
      format: (props) => {
          const {
              hashTag
          } = props;
          return `${hashTag[0]}<a href="https://twitter.com/hashtag/${hashTag.substring(1)}">${hashTag.substring(1)}</a>`
      }
  };
  return Object.assign(getCompositeObj(props), {
      hashTag
  })
}

/**
* This variable stores the mapping between types and formatters.
*/
const formatterMapping = {
  entity: entityFormatter,
  twitterUsername: twitterUsernameFormatter,
  link: linkFormatter,
  twitterHashtag: twitterHashtagFormatter,
};

/**
* 
* @param {string} crawledString | crawledString is the output of module one
* @param {array} parsedObj | paresedObj is the output of module two. parsedObj is array of objects.
* This is the main method used to generate the module three output.
*/
const newsReader = (crawledString, parsedObj) => {
  let processedString = crawledString;
  parsedObj.forEach(obj => {
      const {
          startIndex,
          endIndex,
          type
      } = obj;
      const stringToBeParsed = crawledString.substring(startIndex, endIndex);
      //Checking if the formatter mapping exists and if the mapping is of type function to avoid errors
      if (formatterMapping[type] && typeof formatterMapping[type] === 'function') {
          const formattedString = formatterMapping[type](stringToBeParsed);
          //Checking if the formatter mapping is actually a formatInterface
          if (Object.getPrototypeOf(formattedString).type === "formatInterface") {
              processedString = processedString.replace(stringToBeParsed, formatterMapping[type](stringToBeParsed).format());
          }
      }
  })
  return processedString;
}

//Output one : output for the example given in technical challenge
const output1 = newsReader("Obama visited Facebook headquarters: http://bit.ly/xyz @elversatile", [{
  startIndex: 14,
  endIndex: 22,
  type: 'entity'
}, {
  startIndex: 0,
  endIndex: 5,
  type: 'entity'
}, {
  startIndex: 55,
  endIndex: 67,
  type: 'twitterUsername'
}, {
  startIndex: 37,
  endIndex: 54,
  type: 'link'
}]);

//Output two: output for the example that contains hashtag type
const output2 = newsReader("Obama visited Facebook headquarters: http://bit.ly/xyz @elversatile #usPrez", [{
  startIndex: 14,
  endIndex: 22,
  type: 'entity'
}, {
  startIndex: 0,
  endIndex: 5,
  type: 'entity'
}, {
  startIndex: 55,
  endIndex: 67,
  type: 'twitterUsername'
}, {
  startIndex: 37,
  endIndex: 54,
  type: 'link'
}, {
  startIndex: 68,
  endIndex: 76,
  type: 'twitterHashtag'
}]);

//Output three: output for the example that contains invalid type that are not there in the mapped object
const output3 = newsReader("Obama visited Facebook headquarters: http://bit.ly/xyz @elversatile #usPrez", [{
  startIndex: 14,
  endIndex: 22,
  type: 'entityInvalid'
}, {
  startIndex: 0,
  endIndex: 5,
  type: 'entity'
}, {
  startIndex: 55,
  endIndex: 67,
  type: 'twitterUsernameInvalid'
}, {
  startIndex: 37,
  endIndex: 54,
  type: 'link'
}, {
  startIndex: 68,
  endIndex: 76,
  type: 'twitterHashtag'
}]);

console.log(output1);
console.log(output2);
console.log(output3);