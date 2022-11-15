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

GQL을 서버에서 api를 작성하는 방법

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

<br>

# Apollo Client

GQL을 프론트에서 받아 오는 방법

GraphQL을 사용하여 로컬 및 원격 데이터를 모두 관리할 수 있는 JavaScript용 상태 관리 라이브러리
UI를 자동으로 업데이트하면서 애플리케이션 데이터를 가져오고, 캐시하고, 수정하는 데 사용한다.

https://www.apollographql.com/docs/react

## 클라이언트 시작

```javascript
import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});
```

- uri : 자원이 있는 uri를 문자열로 작성
- cache : 설정한 쿼리 결과물을 브라우저 캐시에 저장해놓음 어떤 캐시에 저장할지 설정 가능

<br>

App에 Provider를 감싸준다.
Provider는 기본적으로 앱 안의 모두가 속성값(client)에 접근할 수 있게 해준다.

index.tsx

```javascript
<ApolloProvider client={client}>
  <RouterProvider router={router} />
</ApolloProvider>
```

컴포넌트에서 Provider로 감싼 client를 사용할 때는 hook을 사용한다.

```javascript
export default function Movies() {
  const client = useApolloClient();
  return <div>sdas</div>;
}
```

## useQuery

useQuery 훅을 사용하여 React에서 GraphQL 데이터를 가져오고 그 결과를 UI에 연결할 수 있다.

Apollo 애플리케이션에서 쿼리를 실행하기 위한 기본 API.

컴포넌트가 렌더링될 때 useQuery는 UI를 렌더링하는 데 사용할 수 있는 loading, error, data 속성이 포함된 Apollo Client의 객체를 반환한다.

이 객체는 client에 설정한 cache에 저장되며 만약 새로운 데이터가 전달된다면 캐시를 새로운 데이터로 저장한다.

loading (boolean) : data를 받아오는 중인지
error : Error
data : 요청한 data

```javascript
const ALL_MOVIES = gql`
  query getMovies {
    allMovies {
      title
      id
    }
  }
`;

const { data, loading } = useQuery(ALL_MOVIES);
```

### argument와 사용하는 useQuery

```javascript
const GET_MOVIE = gql`
  query getMovie($movieId: String!) {
    movie(id: $movieId) {
      id
      title
    }
  }
`;

const { data, loading, error } = useQuery(GET_MOVIE, {
  variables: {
    movieId: params.id,
  },
});
```

variables에 필요한 인자를 넣어서 사용한다.

### Local Only Fileds

https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/

Apollo 클라이언트 쿼리에는 GraphQL 서버의 스키마에 정의되지 않은 로컬 전용 필드가 포함될 수 있다.

@client 지시문은 isLike가 로컬 전용 필드임을 Apollo Client에 알려준다.

```javascript
const GET_MOVIE = gql`
  query getMovie($movieId: String!) {
    movie(id: $movieId) {
      id
      title
      medium_cover_image
      rating
      isLike @client
    }
  }
`;
```

isLike는 로컬 전용이므로 Apollo Client가 데이터를 가져올 때 이 속성은 빼고 요청한다.

최종 쿼리 결과는 모든 로컬(cache) 및 원격 필드가 채워진 후에 반환된다.

### writeFragment

readFragment를 사용하여 Apollo 클라이언트 캐시에서 "random-access" 데이터를 읽는 것 외에도 writeFragment 메서드를 사용하여 캐시에 데이터를 쓸 수 있다.

writeFragment를 사용하여 캐시된 데이터에 대한 변경 사항은 GraphQL 서버에 푸시되지 않는다.
환경을 다시 로드하면 이러한 변경 사항이 사라진다.

```javascript
const onClick = () => {
  cache.writeFragment({
    id: `Movie:${id}`,
    fragment: gql`
      fragment MovieFragment on Movie {
        isLike
      }
    `,
    data: {
      isLike: !data.movie.isLike,
    },
  });
};
```
