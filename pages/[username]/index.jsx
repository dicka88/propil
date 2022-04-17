import React from 'react';
import Head from 'next/head';
import Cookie from 'universal-cookie';
import jwtDecode from 'jwt-decode';

import { getResumeByUsername } from '../../services/resume.service';
import PreviewResume from '../../components/PreviewResume';

function Username({ resume, user }) {
  return (
    <div className="mx-auto">
      <Head>
        <title>{resume.name}</title>
        <link rel="icon" type="image/png" href={resume.picture} />
      </Head>
      {!resume.isPublic && resume.user_id === user.user_id && (
        <div className="bg-black text-white p-4 text-center">
          <p className="font-bold">
            Only you can see this page
          </p>
        </div>
      )}
      <PreviewResume
        name={resume.name}
        age={resume.age}
        picture={resume.picture}
        intro={resume.intro}
        jobtitle={resume.jobTitle}
        workExperiences={resume.workExperiences}
        links={resume.links}
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { username } = context.query;
  const { cookie } = context.req.headers;

  const univeralCookie = new Cookie(cookie);
  const token = univeralCookie.get('token');

  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (err) {
      console.eror(err);
    }
  }


  const resume = await getResumeByUsername(username);

  if (!resume) {
    return {
      notFound: true
    };
  }

  // if resume is private and is not their own then return 404
  if (!resume.isPublic && resume.user_id !== user?.user_id) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      user,
      resume
    }
  };
}

export default Username;