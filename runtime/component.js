register(function (question, customQuestionSettings, questionViewSettings) {

  var gauge = {

    q: question,
    qid: question.id,
    qSel: "#" + question.id,
    semiOne: "",
    semiTwo: "",
    semiFixed: "",

    Render: function() {
      //BEGIN MARKUP
      var ariaLabel = "";
      if(this.q.text != "") {
        $('<div id="' + this.qid + '_text" class="cf-question__text">' + this.q.text + '</div>').appendTo(this.qSel);
        ariaLabel = this.qid + "_text";
      }
      if(this.q.instruction != "") {
        $('<div id="' + this.qid + '_instruction" class="cf-question__instruction">' + this.q.instruction + '</div>').appendTo(this.qSel);
        ariaLabel = (ariaLabel == "") ? this.qid + "_instruction" : ariaLabel + " " + this.qid + "_instruction";
      }
      $('<div class="cf-question__error cf-error-block cf-error-block--bottom cf-error-block--hidden" id="' + this.qid + '_error" role="alert" aria-labelledby="' + this.qid + '_error_list"><ul class="cf-error-list" id="' + this.qid + '_error_list"></ul></div>').appendTo(this.qSel);
      $('<div class="cf-question__content" style="width:230px; padding:14px">'+
      '<div class="cq-gauge" tabindex="0" aria-labelledby="' + ariaLabel + '" aria-errormessage="' + this.qid + '_error" aria-valuemin="0" aria-valuemax="100">'+
      '<div class="cq-gauge__container"><div id="semi1_' + this.qid + '" class="cq-gauge__semicircle cq-gauge__semicircle--in-motion-1"></div><div id="semi2_' + this.qid + '" class="cq-gauge__semicircle cq-gauge__semicircle--in-motion-2"></div><div id="semi3_' + this.qid + '" class="cq-gauge__semicircle cq-gauge__semicircle--fixed"></div><div id="innerArea_' + this.qid + '" class="cq-gauge__inner-area" aria-live="polite"><p id="indicator_' + this.qid + '" class="cq-gauge__label"></p></div></div></div>'+
      '<div class="cq-gauge__controls"><button id="btn1_' + this.qid + '" type="button" class="cq-gauge__button" aria-label="decrease selection" aria-controls="innerArea_' + this.qid + '">-</button><button id="btn2_' + this.qid + '" type="button" class="cq-gauge__button" aria-label="increase selection" aria-controls="innerArea_' + this.qid + '">+</button>'+
      '</div></div>').appendTo(this.qSel);
      $('.cq-gauge__semicircle--in-motion-1, .cq-gauge__semicircle--in-motion-2').css('background-color', customQuestionSettings.dialColor);
      $('.cq-gauge__label').css('color', customQuestionSettings.labelColor);
      $('.cq-gauge__button').css('background-color', customQuestionSettings.buttonColor);
      //END MARKUP
      this.semiOne = document.getElementById("semi1_" + this.qid);
      this.semiTwo = document.getElementById("semi2_" + this.qid);
      this.semiFixed = document.getElementById("semi3_" + this.qid);
      if(this.q.value) { //PREVIOUSLY ANSWERED
        var r = this._ComputeRotation(parseInt(this.q.value));
        if(r <= 180) {
          this._SetRotation(r, this.semiOne);
          this._SetRotation(r, this.semiTwo);
        }
        else {
          this._SetRotation(180, this.semiOne);
          this._SetRotation(r, this.semiTwo, true);
        }
        document.getElementById("indicator_" + this.qid).innerHTML = "" + this.q.value + "%";
        this.onValidation();
      }
    }, //END RENDER

    onGaugeChange: function(answer) {
      this.q.setValue(answer);
    },

    onValidation: function() {
      this.q.validationCompleteEvent.on(function(e) {
        console.log("TESTING");
        console.log(e);
        if(e.errors.length == 0) {
          console.log('#' + this.qid + '_error_list')
          $('#' + this.qid + '_error_list').empty();
          $(this.qSel + ' .cf-question__error').addClass("cf-error-block--hidden");
          $(this.qSel + ' .cq-gauge').attr("aria-invalid", "false");
        }
        else {
          $(this.qSel + ' .cf-question__error').removeClass("cf-error-block--hidden");
          $(this.qSel + ' .cq-gauge').attr("aria-invalid", "true");
          for(var i = 0; i < e.errors.length; i++) {
            $('<li class="cf-error-list__item">' + e.errors[i].message + '</li>').appendTo('#' + this.qid + '_error_list');
          }
        }
      });
    },

    SetIncrease: function() {
      var r1 = this._GetRotation(this.semiOne);
      var r2 = this._GetRotation(this.semiTwo);
      var percent = "";
      if( r1 < 180 ) {
        r1 = r1 + this._GetRotationIncrement();
        r2 = r1;
        if( r1 > 180 ) {
          r1 = 180;
          percent = this._ComputePercent(r2);
          this._SetRotation(r1, this.semiOne);
          this._SetRotation(r2, this.semiTwo, true);
        }
        else {
          var percent = this._ComputePercent(r1);
          this._SetRotation(r1, this.semiOne);
          this._SetRotation(r2, this.semiTwo);
        }
      }
      else if( r1 == 180 ) {
        r2 = (r2 + this._GetRotationIncrement() < 360) ? r2 + this._GetRotationIncrement() : 360;
        percent = this._ComputePercent(r2);
        this._SetRotation(r2, this.semiTwo, true);
      }
      document.getElementById("indicator_" + this.qid).innerHTML = "" + percent + "%";
      this.onGaugeChange(percent);
    },

    SetDecrease: function() {
      var r1 = this._GetRotation(this.semiOne);
      var r2 = this._GetRotation(this.semiTwo);
      var percent = "";
      if( r2 > 180 ) {
        r2 = r2 - this._GetRotationIncrement();
        if( r2 < 180 ) {
          r1 = r2;
          percent = this._ComputePercent(r1);
          this._SetRotation(r1, this.semiOne);
          this._SetRotation(r2, this.semiTwo, false);
        }
        else {
          percent = this._ComputePercent(r2);
          this._SetRotation(r2, this.semiTwo);
        }
      }
      else if( r2 <= 180 ) {
        r2 = (r2 - this._GetRotationIncrement() > 0) ? r2 - this._GetRotationIncrement() : 0;
        r1 = r2;
        percent = this._ComputePercent(r2);
        this._SetRotation(r1, this.semiOne);
        this._SetRotation(r2, this.semiTwo, false);
      }
      document.getElementById("indicator_" + this.qid).innerHTML = "" + percent + "%";
      this.onGaugeChange(percent);
    },

    _GetRotation: function(elem) {
      /*
        IN: gauge semicircle target (HTMLElement Object)
        OUT: degrees 0 to 360 (number)
      */
      var x = elem.style.transform;
      return x ? parseInt(x.split("(")[1].split("deg")[0]) : 0;
    },
    _SetRotation: function(rot, elem, flip) {
      /*
        IN: degrees 0 to 360 (number)
        IN: gauge semicircle target (HTMLElement Object)
        IN: flip, flip back, or don't flip the zindex (boolean || null)
        OUT: VOID
      */
      elem.style.transform = "rotate(" + rot + "deg)";
      b = (flip !== undefined) ? flip : "SKIP";
      if(b === true) {
        this.semiTwo.style.zIndex = "3";
        this.semiFixed.style.zIndex = "2";
      }
      else if(b === false) {
        this.semiTwo.style.zIndex = "2";
        this.semiFixed.style.zIndex = "3";
      }
    },
    _ComputePercent: function(rot) {
      /*
        IN: degrees 0 to 360 (number)
        OUT: percent 0 to 100 (number)
      */
      return Math.round(rot / 360 * 100);
    },
    _ComputeRotation: function(percent) {
      /*
        IN: percent 0 to 100 (number)
        OUT: degress 0 to 360 (number)
      */
      return Math.round(360 / (100 / parseInt(percent)));
    },
    _GetRotationIncrement: function() {
      /*
        SETTINGS: percent 1 to 50 (string)
        OUT: degrees 4 to 180 (number)
      */
      return Math.round(360 / (100 / parseInt(customQuestionSettings.incrementAmount)));
    }
  }

  gauge.Render();
  gauge.onValidation();
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
