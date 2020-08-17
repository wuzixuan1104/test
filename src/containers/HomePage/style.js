import styled from 'styled-components';

const Wrapper = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh; 
  background: rgb(8, 172, 255);
  padding: 10px;
`;

const CardWrapper = styled('div')`
  display: flex;
  width: 100%;
  padding: 20px 0;
  overflow-x: auto;
`;

const CardBlock = styled('div')`
  display: inline-block;
  height: calc(100vh - 100px);
  + * {
    margin-left: 10px;
  }
`;

export { Wrapper, CardWrapper, CardBlock };
