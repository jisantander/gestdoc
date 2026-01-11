
import API from './url-base';


const parseStage = (data) => {
  var dataTable = [];
  data.stageList.forEach(element => {
    dataTable.push({
      name: element._stageName,
      //  ntask: element._tasks.length,
      ntask: element.array_task.length,
      id: element._id
    });
  });
  return dataTable;
};

const get_stages_task = (id) => new Promise((resolve, reject) => {
  fetch(API + 'process/'+ id +'/stagestask')
    .then((response) => response.json())
    .then((data) => {
      console.log('data', data);
      const dataTable = parseStage(data);
      resolve({ stage: dataTable });
    })
    .catch(reject);
});

const post_state = (data, id, preview) => new Promise((resolve, reject) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _stageName: data.name })
  };
  fetch(API + 'stage', requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log('postStage', data);
      preview.push(data._id);
      console.log('preview', preview);
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _stages: preview })
      };

      fetch(API + 'process/'+id, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log('process', data);

          // resolve({ stage: dataTable });
        })
        .catch(reject);

      //const dataTable = parseStage([data]);
      //resolve({ stage: dataTable });
    })
    .catch(reject);
});




export { get_stages_task, post_state };