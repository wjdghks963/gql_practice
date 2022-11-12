# gql_practice

GraphQL 연습

[GraphQL 이란](https://graphql.org/)

A query language for your API

[GraphQL Spec](https://github.com/graphql/graphql-spec)

## REST API의 단점을 고치기 위한 GQL API

gql에서는 모든 요청을 구체적으로 보내야한다.

ex)
array 상태의 object 데이터는 그 안에 있는 속성까지 정해야한다.

### 필요한 것만 요청하고 그것만 받음 (over-fetching 해결)

over-fetching되는 데이터들을 정제할 수 있다.

ex)
프론트에서 post에 대한 title만 필요 but post id, title, content.. 등 다양한 데이터 들이 더 전송됨

gql은 필요한 데이터들만 요청해서 받을 수 있다.

### 필요한 것보다 덜 받음 (under-fetching 해결)

이어지는 데이터가 있으면 api를 두 번 세 번을 받아야 할 경우가 있다.

많은 request가 필요하다면 중간에 실패한 경우가 생길 수 있고 웹이 느려질 수 있다.

ex)
유행하는 영화에 대한 정보를 받았는데 장르가 id로 나옴 > 영화에 대한 정보 api & 장르에 대한 api

gql은 필요한 모든 data를 하나의 request로 받을 수 있다.

## 브라우저에서 api 만들어보기

[Swapi-GraphQL](https://graphql.org/swapi-graphql)

브라우저에서 gql 쿼리를 작성, 검증, 테스트하기 위한 브라우저 도구

# Apollo Server

https://www.apollographql.com/docs/apollo-server/

Apollo 서버는 Apollo 클라이언트를 포함한 모든 GraphQL 클라이언트와 호환되는 사양 준수(spec-compliant)의 오픈 소스 GraphQL 서버

모든 소스의 데이터를 사용할 수 있는 자체 문서화 가능한 production-ready GraphQL API를 구축하는 가장 좋은 방법

post man과 같은 studio를 제공한다.

## 서버 시작

server.js

```javascript
const typeDefs = gql`
  type Tweet {
    id: ID
    text: String
  }
  type Query {
    allTweets: [Tweet]
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`${url} is running`);
});
```

1. gql에게 data의 shema를 알려줘야한다. (typeDefs)
   SDL에서 type Query 안에 들어가는 타입들은 request가 가능하게 만드는 것이기 때문에 REST API에서의 GET요청과 같다.

2. apolloserver를 연다
   만약 type query가 없다면 서버가 시작하지 못 할 것이다.

## Docstring

https://www.apollographql.com/docs/resources/graphql-glossary/#docstring

type, field 또는 argument에 대한 설명을 제공한다.
독스트링은 Apollo Studio Explorer를 포함한 많은 일반적인 GraphQL 도구에 자동으로 나타난다.

```javascript

// type에 대한 문서화 설명
"""
Tweet은 Text와 id를 가지고 있습니다.
"""
type Tweet {
    id: ID!
    text:string
    // 속성에 대한 문서화 설명
    """
    text는 트윗 내용이 들어간 string입니다.
    """
}
```

## Scalar types

https://graphql.org/learn/schema/#scalar-types

GraphQL 객체 타입에는 이름과 필드가 있지만 이 필드는 더욱 구체적인 데이터로 해석되어야 한다.

그 때 스칼라 타입을 사용할 수 있습니다.

ex) ID

## type argument

데이터를 찾을 떄 id를 기준으로 찾을 때가 있을 것이다.
어느 무언가를 특정해서 찾고 싶을 때 Type에 인자를 줄 수 있다.

```javascript
const typeDefs = gql`
  type Tweet {
    id: ID
    text: String
  }
  type Query {
    allTweets: [Tweet]
    tweet(id: ID): Tweet
  }
`;
```

<br>

## Mutations

https://graphql.org/learn/queries/#mutations

GraphQL에 대한 대부분은 데이터 fetching이지만, **서버 측 데이터를 수정할 수 있는 방법이 필요하다.**

서버 측 데이터를 수정하는 모든 작업은 mutation을 통해 보내야 한다는 규칙을 설정하는 것이 유용하다.

REST API에서의 GET 이외의 method를 사용할 때 mutation을 사용해야한다.

```javascript
const typeDefs = gql`
  type Tweet {
    id: ID
    text: String
  }
  type Query {
    allTweets: [Tweet]
    tweet(id: ID): Tweet
  }
  type Mutation {
    postTweet(text: String, userId: ID): Tweet
    deletTweet(id: ID): Boolean
  }
`;
```

```javascript
mutation {
    postTweet(text:"hihi", userId:"1"){
        text
    }
}
```

## Non Nullable Fileds

기본적으로 type 안에 있는 query는 nullable이지만 !를 붙이면 무조건 null이 아닌 값이 있어야한다.

Non-Null로 표시하게 되면 서버가 항상 이 필드에 대해 null이 아닌 값을 반환할 것으로 예상하기 때문에 null 값을 얻게 되면 클라이언트에게 문제가 있음을 알려준다.

```javascript
const typeDefs = gql`
  type Query {
    id: ID!
    text: String
  }
`;
```

위에서 id는 무조건 꼭 있어야한다.

## resolvers

[fields-resolvers](https://graphql.org/learn/execution/#root-fields-resolvers)

[resolver-arguments](https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments)

gql는 어떤 언어와도 사용이 가능하다.

resolver 함수는 데이터베이스에 액세스한 다음 데이터를 반환한다.

```javascript
const resolvers = {
  Query: {
    allTweet() {
      return tweets;
    },
    tweet(root, args) {
      return tweets.find((tweet) => tweet.id === args.id);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = { id: tweets.length + 1, text };
      tweets.push(newTweet);
      return newTweet;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
```

type에서 설정한 arg는 resolver function의 두 번째 arg에 있다.
위의 함수 return 에는 원래 SQL이나 ORM 코드가 들어있어야한다.

### Resolver arguments

Resolver 함수에는 parent(root or source), args, context, info 의 네 가지 인수가 순서대로 전달된다.

```javascript
const resolver = {
  User: {
    fullName: (root, args, context, info) => {
      return "hello";
    },
  },
};
```

실제 데이터에 없는 속성이지만 SDL안에서 type을 주었다면 resolver 안에서 찾는 Type으로 정의된 함수가 있는지 찾은 후 그 함수의 리턴 값을 데이터로 줄 수 있다.

ex)

```javascript
type User{
    id: ID
    firName: string
    lastName: string
}

const resolver = {
    User:{
        fullName({firName,lastName}){
            return `${firName}${lastName}`
        }
    }
}
```

1. root
   부르는 Object의 값이 나온다. ex) fullName에서 root는 User의 정보
2. args
   Type에서 정의했던 args의 자리
