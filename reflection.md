# Reflection on this task

## Making a parsing algorithm

The most difficult thing was to build such an algorithm, that can correctly parse all tokens.

Firstly, I've thought about using syntax tree, like in compilers. But eventually realised, that this is an overkill for this task.

Secondly, I've decided to try build a function, that will be parsing tokens depending on the first token until it reaches this token again.

## Making a good regex for tokenization

First tries with regexes was a little bit painful. Sometimes it was hard to tell, why my regex doesn't match the input string. But eventually after certain amount of tries it became more clear how to modify it properly and why it doesn't match the string.

In the end I've even made the function for checking the token if it is a number. For this task regexes suited perfectly.

## Conclusion

Regexes weren't the hardest part. It just takes time and practise to familiarise yourself with them and become comfortable using them. 