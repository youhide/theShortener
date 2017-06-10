import test from 'ava';
import shortener from './';

test('Short google.com', t => {
  if(shortener.gen('google.com') === 'bd2qnc'){
    t.pass();
  }else{
    t.fail();
  }
});

test('Short https://google.com', t => {
  if(shortener.gen('https://google.com') === 'bwmbGK'){
    t.pass();
  }else{
    t.fail();
  }
});
