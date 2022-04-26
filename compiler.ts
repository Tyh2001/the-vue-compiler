interface tokensType {
  type: string
  value: string
}

interface astType {
  type: string
  body: any
}

/**
* 标记器
* 
* 将全部的传入字符串循环一遍
* 将每种不同的字符串标记不同的类型
* 
* @param input 传入的字符串
*/
function tokenizer(input: string): tokensType[] {
  // 用于像光标一样跟踪我们在代码中的位置
  let current: number = 0

  // 用于将我们的令牌推送出去
  const tokens: tokensType[] = []

  while (current < input.length) {
    // 获取每一个字段
    let char = input[current]
    // console.log(char)

    // 检查左括号
    if (char === '<') {
      tokens.push({
        type: 'paren',
        value: '<',
      })
      current++
      // 继续进入下一次循环
      // continue 语句的作用是跳过本次循环体中余下尚未执行的语句
      // 立即进行下一次的循环条件判定，可以理解为仅结束本次循环
      continue
    }

    // 检查右括号
    if (char === '>') {
      tokens.push({
        type: 'paren',
        value: '>',
      })
      current++
      continue
    }

    // 检查空格
    const WHITESPACE: RegExp = /\s/
    if (WHITESPACE.test(char)) {
      current++
      continue
    }

    // 检查数字
    const NUMBERS: RegExp = /[0-9]/
    if (NUMBERS.test(char)) {
      let value: string = ''

      // 循环遍历序列中的每个字符，直到不是数字的时候
      while (NUMBERS.test(char)) {
        value += char
        char = input[++current]
      }

      // number 标记推送到 tokens 数组
      tokens.push({ type: 'number', value })
      continue
    }

    // 检查双引号
    if (char === '"') {
      let value: string = ''
      char = input[++current]

      while (char !== '"') {
        value += char
        char = input[++current]
      }

      char = input[++current]
      tokens.push({ type: 'string', value })
      continue
    }

    // 检查字母
    const LETTERS: RegExp = /[a-z]/i
    if (LETTERS.test(char)) {
      let value: string = ''

      while (LETTERS.test(char)) {
        value += char
        char = input[++current]
      }

      tokens.push({ type: 'name', value })
      continue
    }

    // 检查斜线
    if (char === '/') {
      tokens.push({
        type: 'slash',
        value: '/',
      })
      current++
      continue
    }

    // 如果没有匹配一个角色将抛出错误
    throw new TypeError(`我不知道这个角色是什么：${char}`)
  }

  // 返回结构的数组
  return tokens
}

/**
 * 解析器 - 语法分析
 * 
 * 解析器需要传入的是标记器返回的结果
 * 需要把标记数组进行转换
 * [{ type: 'paren', value: '<' }, ...] => { type: 'Program', body: [...] }
 * 
 * @param tokens 标记器返回的结果
 */
function parser(tokens: tokensType[]): astType {

  // interface nodeType {
  //   type: string
  //   name?: string
  //   value: string
  //   params: []
  // }

  // 用作游标
  let current: number = 0

  // 使用递归而不是 while 循环
  function walk() {
    let token: tokensType = tokens[current]

    // console.log(token)

    // 如果是数字
    if (token.type === 'number') {
      current++
      return {
        type: 'NumberLiteral',
        value: token.value
      }
    }

    // 如果是字符串
    if (token.type === 'string') {
      current++
      return {
        type: 'StringLiteral',
        value: token.value
      }
    }

    // 如果是左尖括号
    if (token.type === 'paren' && token.value === '<') {

      token = tokens[++current] // {type: 'name', value: 'h'}

      // 调用表达式
      // {type: 'CallExpression', name: 'h', params: Array(0)}
      const node = {
        type: 'CallExpression',
        name: token.value,
        params: []
      }


      token = tokens[++current] // {type: 'number', value: '1'}

      console.log(node)

      while (
        (token.type !== 'paren') ||
        (token.type === 'paren' && token.value !== '>')
      ) {
        node.params.push(walk())
        console.log(node)
        token = tokens[current]
        console.log(token)
        // debugger
      }

      current++
      console.log(node)
      return node
    }
    throw new TypeError(token.type)
  }

  const ast: astType = {
    type: 'Program',
    body: []
  }

  while (current < tokens.length) {
    console.log(walk())
    ast.body.push(walk())
  }

  return ast
}

console.log(tokenizer('<h1>hello world</h1>'))
// console.log(parser(tokenizer('<h1hello<h1')))
