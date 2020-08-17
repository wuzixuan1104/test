import React from "react";
import { Wrapper, CardWrapper, CardBlock } from './style';
import { CardList, Header } from 'shelloUI';

const cardDemo = [
  {
    title: '我是第一張卡片',
    tag: true
  },
  {
    title:
      '我是第二張很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長卡片',
    tag: true,
    tagColor: 'rgba(242, 214, 1, 1.00)'
  },
  {
    title: '我是第三張卡片',
    tag: true,
    tagColor: 'rgba(2, 121, 191, 1.00)'
  }
];

const cardLongDemo = [
  {
    title: '我是第一張卡片',
    tag: true
  },
  {
    title:
      '我是第二張很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長卡片',
    tag: true,
    tagColor: 'rgba(242, 214, 1, 1.00)'
  },
  {
    title: '我是第三張卡片',
    tag: true,
    tagColor: 'rgba(2, 121, 191, 1.00)'
  },
  {
    title: '我是第一張卡片',
    tag: true
  },
  {
    title:
      '我是第二張很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長卡片',
    tag: true,
    tagColor: 'rgba(242, 214, 1, 1.00)'
  },
  {
    title: '我是第三張卡片',
    tag: true,
    tagColor: 'rgba(2, 121, 191, 1.00)'
  }
];
const HomePage = () => {
  return (
    <Wrapper>
      <Header title="Shello App" />
      <CardWrapper>
        <CardBlock><CardList title="嘿嘿嘿" lists={cardLongDemo} /></CardBlock>
        <CardBlock><CardList title="嘿嘿嘿" lists={cardDemo} /></CardBlock>
        <CardBlock><CardList title="嘿嘿嘿" lists={cardLongDemo} /></CardBlock>
        <CardBlock><CardList title="嘿嘿嘿" lists={cardLongDemo} /></CardBlock>
        <CardBlock><CardList title="嘿嘿嘿" lists={cardDemo} /></CardBlock>
        <CardBlock><CardList title="嘿嘿嘿" lists={cardDemo} /></CardBlock>
      </CardWrapper>
    </Wrapper>

  );
};

export default HomePage;
