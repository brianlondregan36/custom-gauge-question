register(function (question, customQuestionSettings, questionViewSettings) {

  var gauge = {

    q: question,
    qid: question.id,
    qSel: "#" + question.id,

    Render: function() {
      var ariaLabel = "";
      if(this.q.text != "") {
        $('<div id="' + this.qid + '_text" class="cf-question__text">' + this.q.text + '</div>').appendTo(this.qSel);
        ariaLabel = this.qid + "_text";
      }
      if(this.q.instruction != "") {
        $('<div id="' + this.qid + '_instruction" class="cf-question__instruction">' + this.q.instruction + '</div>').appendTo(this.qSel);
        ariaLabel = (ariaLabel == "") ? this.qid + "_instruction" : ariaLabel + " " + this.qid + "_instruction";
      }
      $('<div class="cf-question__content" style="width:230px; padding:14px">'+
      '<div class="cq-gauge" tabindex="0" aria-labelledby="' + ariaLabel + '" aria-valuemin="0" aria-valuemax="100">'+
      '<div class="cq-gauge__container"><div id="semi1_' + this.qid + '" class="cq-gauge__semicircle cq-gauge__semicircle--in-motion-1"></div><div id="semi2_' + this.qid + '" class="cq-gauge__semicircle cq-gauge__semicircle--in-motion-2"></div><div id="semi3_' + this.qid + '" class="cq-gauge__semicircle cq-gauge__semicircle--fixed"></div><div id="innerArea_' + this.qid + '" class="cq-gauge__inner-area" aria-live="polite"><p id="indicator_' + this.qid + '" class="cq-gauge__label"></p></div></div></div>'+
      '<div class="cq-gauge__controls"><button id="btn1_' + this.qid + '" type="button" class="cq-gauge__button" aria-label="decrease selection" aria-controls="innerArea_' + this.qid + '">-</button><button id="btn2_' + this.qid + '" type="button" class="cq-gauge__button" aria-label="increase selection" aria-controls="innerArea_' + this.qid + '">+</button>'+
      '</div></div>').appendTo(this.qSel);
      $('.cq-gauge__semicircle--in-motion-1, .cq-gauge__semicircle--in-motion-2').css('background-color', customQuestionSettings.dialColor);
      $('.cq-gauge__label').css('color', customQuestionSettings.labelColor);
      $('.cq-gauge__button').css('background-color', customQuestionSettings.buttonColor);
    },

    onGaugeChange: function(answer) {
      this.q.setValue(answer);
    },

    SetIncrease: function() {
      var one = document.getElementById("semi1_" + this.qid);
      var two = document.getElementById("semi2_" + this.qid);
      var fixed = document.getElementById("semi3_" + this.qid);
      var indicator = document.getElementById("indicator_" + this.qid);

      var r1 = this._GetRotation(one);
      var r2 = this._GetRotation(two);
      var percent = "";

      if( r1 < 180 ) {
        r1 = parseInt(r1) + this._GetRotationIncrement();
        r2 = r1;
        if( r1 > 180 ) {
          r1 = 180;
          percent = this._ComputePercent(r2);
          r1 = "rotate(" + r1 + "deg)";
          one.style.transform = r1;
          r2 = "rotate(" + r2 + "deg)";
          two.style.transform = r2;
          two.style.zIndex = "3";
          fixed.style.zIndex = "2";
        }
        else {
          var percent = this._ComputePercent(r1);
          r1 = "rotate(" + r1 + "deg)";
          one.style.transform = r1;
          r2 = "rotate(" + r2 + "deg)";
          two.style.transform = r1;
        }
      }
      else if( r1 == 180 ) {
        r2 = (parseInt(r2) + this._GetRotationIncrement() < 360) ? parseInt(r2) + this._GetRotationIncrement() : 360;
        percent = this._ComputePercent(r2);
        r2 = "rotate(" + r2 + "deg)";
        two.style.transform = r2;
        two.style.zIndex = "3";
        fixed.style.zIndex = "2";
      }

      indicator.innerHTML = percent + "%";
      this.onGaugeChange(percent);
    },

    SetDecrease: function() {
      var one = document.getElementById("semi1_" + this.qid);
      var two = document.getElementById("semi2_" + this.qid);
      var fixed = document.getElementById("semi3_" + this.qid);
      var indicator = document.getElementById("indicator_" + this.qid);

      var r1 = this._GetRotation(one);
      var r2 = this._GetRotation(two);
      var percent = "";

      if( r2 > 180 ) {
        r2 = parseInt(r2) - this._GetRotationIncrement();
        if( r2 < 180 ) {
          r1 = r2;
          percent = this._ComputePercent(r1);
          r1 = "rotate(" + r1 + "deg)";
          one.style.transform = r1;
          r2 = "rotate(" + r2 + "deg)";
          two.style.transform = r2;
          two.style.zIndex = "2";
          fixed.style.zIndex = "3";
        }
        else {
          percent = this._ComputePercent(r2);
          r2 = "rotate(" + r2 + "deg)";
          two.style.transform = r2;
        }
      }
      else if( r2 <= 180 ) {
        r2 = (parseInt(r2) - this._GetRotationIncrement() > 0) ? parseInt(r2) - this._GetRotationIncrement() : 0;
        r1 = r2;
        percent = this._ComputePercent(r2);
        r1 = "rotate(" + r1 + "deg)";
        one.style.transform = r1;
        r2 = "rotate(" + r2 + "deg)";
        two.style.transform = r2;
        two.style.zIndex = "2";
        fixed.style.zIndex = "3";
      }

      indicator.innerHTML = percent + "%";
      this.onGaugeChange(percent);
    },

    _GetRotation: function(elem) {
      var x = elem.style.transform;
      return x ? x.split("(")[1].split("deg")[0] : 0;
    },
    _ComputePercent: function(rot) {
      return Math.round(rot / 360 * 100);
    },
    _GetRotationIncrement: function() {
      return Math.round(360 / (100 / parseInt(customQuestionSettings.incrementAmount)));
    }
  }

  gauge.Render();
  var input = document.querySelectorAll("#" + question.id + " .cq-gauge")[0];
  input.onkeydown = function(event) {
    if(event.which == 38 || event.which == 39) {
      event.preventDefault();
      gauge.SetIncrease();
    }
    else if(event.which == 37 || event.which == 40) {
      event.preventDefault();
      gauge.SetDecrease();
    }
  };
  var btns = document.querySelectorAll("#" + question.id + " .cq-gauge__button");
  var dBtn = btns[0];
  dBtn.onclick = function() {
    gauge.SetDecrease();
  }
  var iBtn = btns[1];
  iBtn.onclick = function() {
    gauge.SetIncrease();
  }
});
