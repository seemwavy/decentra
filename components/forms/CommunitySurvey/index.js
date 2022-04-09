import React, {useState, useContext} from 'react'
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import toast from 'react-hot-toast';
import { UserContext } from '@lib/context';
import { firestore, auth, serverTimestamp } from '@lib/firebase';
import { increment } from "firebase/firestore";
import Loader from '@components/simple/Loader';
import styles from './styles.module.scss'

export default function CommunitySurvey() {
  const { username } = useContext(UserContext);
  const [email, setEmail] = useState('') 
  const [zipcode, setZipcode] = useState('') 
  const [instagram, setInstagram] = useState('') 
  const [problem, setProblem] = useState('') 
  const [ideaSolve, setIdeaSolve] = useState('') 
  const [volunteer, setVolunteer] = useState('') 
  const [attend, setAttend] = useState('') 
  const [knowLeader, setKnowLeader] = useState('') 
  const [knowCost, setKnowCost] = useState('') 
  const [decideFund, setDecideFund] = useState('') 
  const [believePublicFund, setBelievePublicFund] = useState('') 
  const [attendInPerson, setAttendInPerson] = useState('') 
  const [attendVideo, setAttendVideo] = useState('') 
  const [attendApp, setAttendApp] = useState('') 
  const [meaningfulReward, setMeaningfulReward] = useState('') 
  const [mostConvenient, setMostConvenient] = useState('') 
  const [barriers, setBarriers] = useState('') 
  const [age, setAge] = useState('') 
  const [description, setDescription] = useState('') 
  const [additional, setAdditional] = useState('') 
  const [loading, setLoading] = useState(false)

  function CheckSurveyValid(){
    const surveyAnswers = [email, zipcode, instagram, problem, ideaSolve, volunteer, attend, knowLeader, knowCost, decideFund, believePublicFund, 
                          attendInPerson, attendVideo, attendApp, meaningfulReward, mostConvenient, barriers, age, description, additional]
    
    let incompleteAnswers = []

    surveyAnswers.forEach((answer) => {
      if(answer == ''){
        incompleteAnswers.push(answer)
      }
    })

    if( incompleteAnswers.length > 0 ){
      return false
    }
    else return true
  }

  const SubmitSurveyResults = async(e) =>{
    setLoading(true)
    e.preventDefault();
    let valid = false
    valid = CheckSurveyValid()

    if(valid){
      const uid = auth.currentUser.uid;
      const userDoc = firestore.doc(`users/${uid}`);
      const resultsDoc = firestore.doc('Surveys/communitySurveyResults');
      const surveyRef = firestore.collection('users').doc(uid).collection('communitySurveyResults').doc(uid);
      const awardRef = firestore.collection('users').doc(auth.currentUser.uid).collection('awards').doc('thinker');
 
      const data = {
        email: email,
        zipcode: zipcode,
        instagram: instagram,
        problem: problem,
        ideaSolve: ideaSolve,
        volunteer: volunteer,
        attend: attend,
        knowLeader: knowLeader,
        knowCost: knowCost,
        decideFund: decideFund,
        believePublicFund: believePublicFund,
        attendInPerson: attendInPerson,
        attendVideo: attendVideo,
        attendApp: attendApp,
        meaningfulReward: meaningfulReward,
        mostConvenient: mostConvenient,
        barriers: barriers,
        age: age,
        description: description,
        additional: additional,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        upvotes: 0,
        slug: uid,
        username: username,
      }

      const awardData = {
        received: true,
        joinedAt: serverTimestamp(),
        img: "https://i.imgur.com/S9SFd01.png",
        title: "Thinker LvL 1"
      }

      const surveyPairs = []

      function surveyAggregateData(){

        const surveyData = [attend, believePublicFund, knowLeader, knowCost, decideFund, ideaSolve,  volunteer,  attendApp, attendInPerson, attendVideo, ]

        surveyData.map((data) => {
          if(data){
            surveyPairs.push([data, true])
          }
          else{
            surveyPairs.push([data, false])
          }
        })
      }
    
      await surveyAggregateData()
  

      console.log('here')

      const batch = firestore.batch();
      await surveyRef.set(data);
      await awardRef.set(awardData);
      console.log('here2')
      batch.update(userDoc, {completedSurvey: false, points: increment(10)});
      console.log('here3')

      surveyPairs.map((pair, i) => {
        if(pair[1] == true && i == 0){
          batch.update(resultsDoc, {attendCivicTrue: increment(1)})
        }

        if(pair[1] == true && i == 1){
          batch.update(resultsDoc, {believeFundsTrue: increment(1)})
        }

        if(pair[1] == true && i == 2){
          batch.update(resultsDoc, {knowLeaderTrue: increment(1)})
        }

        if(pair[1] == true && i == 3){
          batch.update(resultsDoc, {moneyDedicationKnowledgeTrue: increment(1)})
        }

        if(pair[1] == true && i == 4){
          batch.update(resultsDoc, {participatedFundsTrue: increment(1)})
        }

        if(pair[1] == true && i == 5){
          batch.update(resultsDoc, {solutionIdeasTrue: increment(1)})
        }

        if(pair[1] == true && i == 6){
          batch.update(resultsDoc, {volunteerTrue: increment(1)})
        }

        if(pair[1] == true && i == 7){
          batch.update(resultsDoc, {voteSpendAppTrue: increment(1)})
        }

        if(pair[1] == true && i == 8){
          batch.update(resultsDoc, {voteSpendAttendTrue: increment(1)})
        }

        if(pair[1] == true && i == 9){
          batch.update(resultsDoc, {voteSpendTrue: increment(1)})
        }

        if(pair[1] == false && i == 0){
          batch.update(resultsDoc, {attendCivicFalse: increment(1)})
        }

        if(pair[1] == false && i == 1){
          batch.update(resultsDoc, {believeFundsFalse: increment(1)})
        }

        if(pair[1] == false && i == 2){
          batch.update(resultsDoc, {knowLeaderFalse: increment(1)})
        }

        if(pair[1] == false && i == 3){
          batch.update(resultsDoc, {moneyDedicationKnowledgeFalse: increment(1)})
        }

        if(pair[1] == false && i == 4){
          batch.update(resultsDoc, {participatedFundsFalse: increment(1)})
        }

        if(pair[1] == false && i == 5){
          batch.update(resultsDoc, {solutionIdeasFalse: increment(1)})
        }

        if(pair[1] == false && i == 6){
          batch.update(resultsDoc, {volunteerFalse: increment(1)})
        }

        if(pair[1] == false && i == 7){
          batch.update(resultsDoc, {voteSpendAppFalse: increment(1)})
        }

        if(pair[1] == false && i == 8){
          batch.update(resultsDoc, {voteSpendAttendFalse: increment(1)})
        }

        if(pair[1] == false && i == 9){
          batch.update(resultsDoc, {voteSpendTrueFalse: increment(1)})
        }
      })

      console.log('here')
      await batch.commit();
      console.log('here5')
      toast.success('Successfully completed our community survey')
      toast.success('Gained 10 points and a BADGE')
    }
    else{
      toast.error('Please complete survey')
    }
    setLoading(false)
  }

  return (
    <div className={styles.form_container}>

      <div>

      </div>

      <form onSubmit={SubmitSurveyResults}>
        <fieldset className={styles.form}> 
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em',  color: 'black', marginLeft: '1em',}}>Which would you say is the single biggest PROBLEM in your neighborhood currently? </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className={styles.form_group}
              onChange={async(e) => {
                await setProblem(e.target.value)
              }}
            >
              <FormControlLabel style={{marginTop: '2em'}} value="Violent crimes (gun crimes, armed robberies, violence against women and/or children)" control={<Radio />} label="Violent crimes (gun crimes, armed robberies, violence against women and/or children)" />
              <FormControlLabel style={{marginTop: '1em'}} value="Non-violent crimes (thefts, vandalism)" control={<Radio />} label="Non-violent crimes (thefts, vandalism)" />
              <FormControlLabel style={{marginTop: '1em'}} value="OtherTrash + pests (collection and rodent control)" control={<Radio />} label="OtherTrash + pests (collection and rodent control)" />

              <FormControlLabel style={{marginTop: '2em'}} value="Education (poor quality schools)" control={<Radio />} label="Education (poor quality schools)" />
              <FormControlLabel style={{marginTop: '1em'}} value="Affordable housing (lack of quality and affordable places to live)" control={<Radio />} label="Affordable housing (lack of quality and affordable places to live)" />
              <FormControlLabel style={{marginTop: '1em'}} value="Drugs (addiction and/or selling)" control={<Radio />} label="Drugs (addiction and/or selling)" />

              <FormControlLabel style={{marginTop: '2em'}} value="Transportation (accessible & affordable options to move throughout the region)" control={<Radio />} label="Transportation (accessible & affordable options to move throughout the region)" />
              <FormControlLabel style={{marginTop: '1em'}} value="Hate crimes / domestic terrorism / racism / homophobia / sexism / etc" control={<Radio />} label="Hate crimes / domestic terrorism / racism / homophobia / sexism / etc" />
              <FormControlLabel style={{marginTop: '1em'}} value="Homelessness / Poverty" control={<Radio />} label="Homelessness / Poverty" />

              <FormControlLabel style={{marginTop: '1em'}} value="Job accessibility and/or training" control={<Radio />} label="Job accessibility and/or training" />
              <FormControlLabel style={{marginTop: '1em'}} value="Other..." control={<Radio />} label="Other..." />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em',  color: 'black', marginLeft: '1em',}}>Do you have ideas of how to solve this problem – if you had the money to do it? </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className={styles.form_group}
              onChange={async(e) => {
                await setIdeaSolve(e.target.value)
              }}
            >
              <FormControlLabel style={{marginTop: '1em'}} value={true} control={<Radio />} label="Yes" />
              <FormControlLabel style={{marginTop: '1em'}} value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em', color: 'black', marginLeft: '1em',}}>Do you currently volunteer with a community group or local non-profit?  </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className={styles.form_group}
              onChange={async(e) => {
                await setVolunteer(e.target.value)
              }}
            >
              <FormControlLabel style={{marginTop: '1em'}} value={true} control={<Radio />} label="Yes" />
              <FormControlLabel style={{marginTop: '1em'}} value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em',  color: 'black', marginLeft: '1em',}}>Do you currently attend civic association, town hall meetings, or similar community engagement activities?</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              className={styles.form_group}
              onChange={async(e) => {
                await setAttend(e.target.value)
              }}
            >
              <FormControlLabel style={{marginTop: '1em'}} value={true} control={<Radio />} label="Yes" />
              <FormControlLabel style={{marginTop: '1em'}} value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em',  color: 'black', marginLeft: '1em',}}> Do you currently know and/or communicate with your local leaders, council members, or state representatives? </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className={styles.form_group}
              onChange={async(e) => {
                await setKnowLeader(e.target.value)
              }}
            >
              <FormControlLabel style={{marginTop: '1em'}} value={true} control={<Radio />} label="Yes" />
              <FormControlLabel style={{marginTop: '1em'}} value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em',  color: 'black', marginLeft: '1em',}}> In 2022, do you know how much money will be dedicated to community impact projects by your government and local industries?  </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className={styles.form_group}
              onChange={async(e) => {
                await setKnowCost(e.target.value)
              }}
            >
              <FormControlLabel style={{marginTop: '1em'}} value={true} control={<Radio />} label="Yes" />
              <FormControlLabel style={{marginTop: '1em'}} value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em',  color: 'black', marginLeft: '1em',}}>At any point in time, have you participated in deciding how public funds will be dedicated to community impact projects by your government and local industries?</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className={styles.form_group}
              onChange={async(e) => {
                await setDecideFund(e.target.value)
              }}
            >
              <FormControlLabel style={{marginTop: '1em'}} value={true} control={<Radio />} label="Yes" />
              <FormControlLabel style={{marginTop: '1em'}} value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em',  color: 'black', marginLeft: '1em',}}> Do you believe that public funds scheduled to be spent in 2022 by your local government and industries; will be used to fix some of the problems in your neighborhood? </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className={styles.form_group}
              onChange={async(e) => {
                await setBelievePublicFund(e.target.value)
              }}
            >
              <FormControlLabel style={{marginTop: '1em'}} value={true} control={<Radio />} label="Yes" />
              <FormControlLabel style={{marginTop: '1em'}} value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em', color: 'black', marginLeft: '1em',}}> If you could vote on how to spend a portion of the public funds, but you had to attend in-person meetings to participate, would you want to?  </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className={styles.form_group}
              onChange={async(e) => {
                await setAttendInPerson(e.target.value)
              }}
            >
              <FormControlLabel style={{marginTop: '1em'}} value={true} control={<Radio />} label="Definitely" />
              <FormControlLabel style={{marginTop: '1em'}} value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em', color: 'black', marginLeft: '1em',}}>If you could vote on how to spend some of the public funds but had to attend video meetings to participate, would you want to?</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className={styles.form_group}
              onChange={async(e) => {
                await setAttendVideo(e.target.value)
              }}
            >
              <FormControlLabel style={{marginTop: '1em'}} value={true} control={<Radio />} label="Definitely" />
              <FormControlLabel style={{marginTop: '1em'}} value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em', color: 'black', marginLeft: '1em',}}> If you could vote on how to spend a portion of the public funds, but you had to use a mobile app to participate, would you want to? </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className={styles.form_group}
              onChange={async(e) => {
                await setAttendApp(e.target.value)
              }}
            >
              <FormControlLabel style={{marginTop: '1em'}} value={true} control={<Radio />} label="Definitely" />
              <FormControlLabel style={{marginTop: '1em'}} value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em',  color: 'black', marginLeft: '1em',}}> If you could be rewarded for your civic engagement, which reward would be most meaningful to you?  </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className={styles.form_group}
              onChange={async(e) => {
                await setMeaningfulReward(e.target.value)
              }}
            >
              <FormControlLabel style={{marginTop: '1em'}} value="Money / Cash Rewards" control={<Radio />} label="Money / Cash Rewards" />
              <FormControlLabel style={{marginTop: '1em'}} value="Coupons / Credits for Retail Stores (Groceries, Electronics, Clothing, etc)" control={<Radio />} label="Coupons / Credits for Retail Stores (Groceries, Electronics, Clothing, etc)" />
              <FormControlLabel style={{marginTop: '1em'}} value="Coupons / Credits for Public Services (Transportation, Utilities, Tax Credits, etc)" control={<Radio />} label="Coupons / Credits for Public Services (Transportation, Utilities, Tax Credits, etc)" />
              <FormControlLabel style={{marginTop: '1em'}} value="Investment Credits for Savings (Stocks, Bonds, Cryptocurrency, etc.)" control={<Radio />} label="Investment Credits for Savings (Stocks, Bonds, Cryptocurrency, etc.)" />
              <FormControlLabel style={{marginTop: '1em'}} value="Having my voice heard, and seeing real change in my neighborhood is enough of a reward" control={<Radio />} label="Having my voice heard, and seeing real change in my neighborhood is enough of a reward" />
              <FormControlLabel style={{marginTop: '1em'}} value="Option" control={<Radio />} label="Option" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em', color: 'black', marginLeft: '1em',}}>If you could vote on how to spend a portion of public funds, what would be the most convenient method of voting for you? </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className={styles.form_group}
              onChange={async(e) => {
                await setMostConvenient(e.target.value)
              }}
            >
              <FormControlLabel style={{marginTop: '1em'}} value="Voting in person (It would be more convenient to meet and vote in person)" control={<Radio />} label="Voting in person (It would be more convenient to meet and vote in person)" />
              <FormControlLabel style={{marginTop: '1em'}} value="Voting via video conference (It would be more convenient using a zoom conference call for voting)" control={<Radio />} label="Voting via video conference (It would be more convenient using a zoom conference call for voting)" />
              <FormControlLabel style={{marginTop: '1em'}} value="Voting via mobile app (It would be more convenient to vote from my phone using a mobile app)" control={<Radio />} label="Voting via mobile app (It would be more convenient to vote from my phone using a mobile app)" />
              <FormControlLabel style={{marginTop: '1em'}} value="Voting by mail (It would be more convenient to fill out and mail in a ballot)" control={<Radio />} label="Voting by mail (It would be more convenient to fill out and mail in a ballot)" />
              <FormControlLabel style={{marginTop: '1em'}} value="Voting online (It would be more convenient to vote on a website from my desktop or laptop)" control={<Radio />} label="Voting online (It would be more convenient to vote on a website from my desktop or laptop)" />
              <FormControlLabel style={{marginTop: '1em'}} value="Other" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em', color: 'black', marginLeft: '1em',}}>Are there any barriers currently preventing you from being engaged in community decision-making activities? (Select all that apply)</FormLabel>
            
            <FormControlLabel control={<Checkbox onClick={async(e) => {setBarriers(e.target.value)}} value="I don't know when / where meetings happen" />} label="I don't know when / where meetings happen" />
            <FormControlLabel control={<Checkbox onClick={async(e) => {setBarriers(e.target.value)}} value="I don't have time to attend meetings / voting sessions"/>} label="I don't have time to attend meetings / voting sessions" />
            <FormControlLabel control={<Checkbox onClick={async(e) => {setBarriers(e.target.value)}} value="I don't have transportation to attend in-person meetings" />} label="I don't have transportation to attend in-person meetings" />
            <FormControlLabel control={<Checkbox onClick={async(e) => {setBarriers(e.target.value)}} value="I don't have reliable internet to attend virtual meetings / voting sessions"/>} label="I don't have reliable internet to attend virtual meetings / voting sessions" />
            <FormControlLabel control={<Checkbox onClick={async(e) => {setBarriers(e.target.value)}} value="I don't have any interest in participating in community decision making" />} label="I don't have any interest in participating in community decision making" />
            <FormControlLabel control={<Checkbox onClick={async(e) => {setBarriers(e.target.value)}} value="I feel I am too uninformed to participate in community decision making" />} label="I feel I am too uninformed to participate in community decision making" />
            <FormControlLabel control={<Checkbox onClick={async(e) => {setBarriers(e.target.value)}} value="I don't experience any barriers - I am frequently engaged in community decision making" />} label="I don't experience any barriers - I am frequently engaged in community decision making" />
            <FormControlLabel control={<Checkbox onClick={async(e) => {setBarriers(e.target.value)}} value="Other" />} label="Other" />
          </FormControl>

          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em', color: 'black', marginLeft: '1em',}}> How old are you? </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              className={styles.form_group}
              onChange={async(e) => {
                await setAge(e.target.value)
              }}
            >
              <FormControlLabel style={{marginTop: '1em'}} value="17 or under" control={<Radio />} label="17 or under" />
              <FormControlLabel style={{marginTop: '1em'}} value="18 - 25" control={<Radio />} label="18 - 25" />
              <FormControlLabel style={{marginTop: '1em'}} value="26 - 30" control={<Radio />} label="26 - 30" />
              <FormControlLabel style={{marginTop: '1em'}} value="30 - 41" control={<Radio />} label="30 - 41" />
              <FormControlLabel style={{marginTop: '1em'}} value="42 - 57" control={<Radio />} label="42 - 57" />
              <FormControlLabel style={{marginTop: '1em'}} value="58 - 67" control={<Radio />} label="58 - 67" />
              <FormControlLabel style={{marginTop: '1em'}} value="68+" control={<Radio />} label="68+" />
            </RadioGroup>
          </FormControl>

          <FormGroup  className={styles.form_group}>
            <FormLabel id="demo-radio-buttons-group-label"  style={{marginTop: '2em', color: 'black', marginLeft: '1em', marginBottom: '1.5em'}}> Which description represents you best? (select all that apply) </FormLabel>
            
            <FormControlLabel control={<Checkbox onClick={async(e) => {setDescription(e.target.value)}} value="I am a student" />} label="I am a student" />
            <FormControlLabel control={<Checkbox onClick={async(e) => {setDescription(e.target.value)}} value="I work full-time" />} label="I work full-time" />
            <FormControlLabel control={<Checkbox onClick={async(e) => {setDescription(e.target.value)}} value="I work part-time" />} label="I work part-time" />
            <FormControlLabel control={<Checkbox onClick={async(e) => {setDescription(e.target.value)}} value="I am a parent/guardian"/>} label="I am a parent/guardian" />
            <FormControlLabel control={<Checkbox onClick={async(e) => {setDescription(e.target.value)}} value="I have limited mobility (physical disability)" />} label="I have limited mobility (physical disability)" />
            <FormControlLabel control={<Checkbox onClick={async(e) => {setDescription(e.target.value)}} value="I do not work" />} label="I do not work" />
            <FormControlLabel control={<Checkbox onClick={async(e) => {setDescription(e.target.value)}} value="Other" />} label="Other" />
          </FormGroup>

          <TextField
            className={styles.form_input}
            id="outlined-required"
            label="Required"
            defaultValue="Email Here"
            onChange={async(e) => {
              await setEmail(e.target.value)
            }}
          />
        <TextField
            className={styles.form_input}
            id="outlined-required"
            label="Required"
            defaultValue="Your Zipcode"
            onChange={async(e) => {
              await setZipcode(e.target.value)
            }}
          />

          <TextField
            className={styles.form_input}
            id="outlined-required"
            label="Required"
            defaultValue="Your Instagram"
            onChange={async(e) => {
              await setInstagram(e.target.value)
            }}
          />

          <FormGroup>
            <FormLabel id="demo-radio-buttons-group-label" style={{marginTop: '2em', color: 'black', marginLeft: '1em', marginBottom: '1.5em'}}> Please share any questions, comments, or concerns (optional) </FormLabel>

            <TextareaAutosize
              aria-label="minimum height"
              minRows={3}
              placeholder="Minimum 5 rows"
              style={{ width: '100%', marginTop: '1em', padding: '0.5em' }}
              onChange={(e)=> {setAdditional(e.target.value)}}
            />
          </FormGroup>
        </fieldset>

        <button className={styles.submit} disabled={loading}>{loading? <Loader show={loading}/> : 'Submit'}</button>
      </form>
    </div>
  )
}