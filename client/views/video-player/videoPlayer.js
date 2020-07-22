Template.videoPlayer.onCreated(function () {
  this.videoObj = video;
  this.markers = new ReactiveVar([])
  this.markersDisparados = new ReactiveVar([]);

  this.markers.set(removeOutrosMarkersPrivados(this.videoObj.markers))
});

Template.videoPlayer.onRendered(function () {
  const video = $('#video')[0];
  this.video = video;
  this.video.volume = 0.5;
});

Template.videoPlayer.events({
  'timeupdate #video': function (e, t) {
    const video = e.target;
    const posicao = video.currentTime / video.duration;

    $(".orange-juice").css('width', posicao * 100 + '%');
    t.markersDisparados.set(disparaMarker(video.currentTime, t.markers.get()));
    $('#timeVideo').text(`${formataCurrentTime(t.video.currentTime)}`);
  },

  'click #play': function (e, t) {
    if (t.video.paused) {
      t.video.play()
      $('.fa-play')
        .removeClass('fa-play')
        .addClass('fa-pause');
    } else {
      t.video.pause()
      $('.fa-pause')
        .removeClass('fa-pause')
        .addClass('fa-play');
    }
  },

  'click #newMarker': function (e, t) {
    $('.newMarker').css('display', 'block');
    $('#textNewMarker').val('');

    $('.timeNewMarker').text(`${formataCurrentTime(t.video.currentTime)}`);
    $('.timeNewMarker').data('time', t.video.currentTime);
  },

  'click #cancelar': function (e, t) {
    $('.newMarker').css('display', 'none');
  },

  'click #marcar': function (e, t) {
    const text = $('#textNewMarker').val();
    const { time } = $('.timeNewMarker').data();
    const posicao = time / t.video.duration;

    const markers = t.markers.get();
    markers.push({
      userId: "Natan",
      time: time,
      percentual: posicao * 100,
      privacidade: $('.sliderInput').prop('checked') ? 'publico' : 'privado',
      text
    })
    t.markers.set(markers);

    $('.newMarker').css('display', 'none');
  },

  'mousedown .orange-bar': function (e, t) {
    const videoTime = (e) => {
      const orangeDiv = $('.orange-bar');
      const handlePixeis = e.pageX - orangeDiv.offset().left;
      const quocienteDivHandle = handlePixeis / orangeDiv.width();
      t.video.currentTime = quocienteDivHandle * t.video.duration
      $(".orange-juice").css('width', quocienteDivHandle * 100 + '%');
      moved = true;
    }

    videoTime(e);

    document
      .addEventListener('mousemove', videoTime);

    document
      .addEventListener('mouseup', function (e) {
        document.removeEventListener('mousemove', videoTime);
      });
  },

  'mousedown .slider-vol-bar': function (e, t) {
    const orangeDiv = $('.slider-vol-bar');
    const handlePixeis = e.pageX - orangeDiv.offset().left;
    const quocienteDivHandle = handlePixeis / orangeDiv.width();
    t.video.volume = quocienteDivHandle;
    $(".slider-vol-state").css('width', quocienteDivHandle * 100 + '%');
  },

  'click #modoVisualizacao': function (e, t) {
    if (e.target.value === 'modoTeatro') {
      $('.video-player').addClass('modoTeatro')
      e.target.value = 'modoNormal';
      $('.fa-expand')
        .removeClass('fa-expand')
        .addClass('fa-compress');
    } else {
      $('.video-player').removeClass('modoTeatro')
      e.target.value = 'modoTeatro';
      $('.fa-compress')
        .removeClass('fa-compress')
        .addClass('fa-expand');
    }
  },

  'click #PIP': function (e, t) {
    t.video.requestPictureInPicture()

  },

  'change .sliderInput': function (e, t) {
    const privacidade = e.target.checked ? 'Publico' : 'Privado';
    $('.privacidade').text(privacidade);
  }
})

Template.videoPlayer.helpers({
  video() {
    return Template.instance().videoObj;
  },

  markers() {
    return Template.instance().markers.get();
  },

  markersDisparados() {
    return Template.instance().markersDisparados.get();
  },

  formataTime(time) {
    return formataCurrentTime(time);
  }
})

const disparaMarker = function (time, markers) {
  return markers.filter((marker) => time >= marker.time && (marker.time + 3) >= time);
}

const video = {
  id: "123123123",
  link: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  markers: [
    { userId: "user exemplo", time: 60, percentual: 10, privacidade: 'publico', text: "que coelho engraçado" },
  ]
}

const removeOutrosMarkersPrivados = function (markers) {
  const userId = 'meuuser'
  return markers.filter((m) => m.privacidade === 'publico' || m.userId === userId);
}

const formataCurrentTime = function (currentTime) {
  const minutos = Math.floor(currentTime / 60);
  const segundos = Math.floor(currentTime % 60);
  return `${String(minutos).padStart(2, '0')} : ${String(segundos).padStart(2, '0')}`;
}