require 'test_helper'

class ShiftsControllerTest < ActionController::TestCase
  setup do
    [
      :four_hour_shift,
      :two_hour_shift
    ].each do |shift|
      this_shift = shifts shift
      @shift ||= this_shift
      self.instance_variable_set("@#{shift.to_s}", this_shift)
    end
    @now = DateTime.now
  end

  def generate_random_shift_length(now = nil)
    (rand 400) + 1
  end

  test 'should get index' do
    get :index
    assert_response :success
    assert_not_nil assigns(:shifts)
  end

  test 'should get new' do
    get :new
    assert_response :success
  end

  test 'should create shift' do
    assert_difference('Shift.count') do
      post :create, shift: {
        start: @now,
        end: @now + 8.hours
      }
    end

    assert_redirected_to shift_path(assigns(:shift))
  end

  test 'should not create shift with ending date before start' do
    assert_no_difference('Shift.count') do
      post :create, shift: {
        start: @now + generate_random_shift_length,
        end: @now
      }
    end
  end

  test 'should show shift' do
    get :show, id: @shift
    assert_response :success
  end

  test 'should get edit' do
    get :edit, id: @shift
    assert_response :success
  end

  test 'should update shift' do
    shift = @four_hour_shift
    [
      :+,
      :-
    ].each do |method|
      (1..5).each do
        day_offset = rand 400
        hour_offset = rand 30
        shift_start = @now.send(method, day_offset.day.send(method, hour_offset))
        shift_end = @now

        if shift_end < shift_start
          shift_end = shift_start + (rand 24).hours
        end

        old_start = shift.start
        old_end = shift.end

        patch :update, id: shift, shift: {
          start: shift_start,
          end: shift_end
        }
        assert_redirected_to shift_path(assigns(:shift))

        updated_shift = Shift.find_by(id: shift.id)

        assert updated_shift.start != old_start, "Starting time was not updated #{updated_shift.start} == #{old_start}"
        assert updated_shift.end != old_end, "Ending time was not updated #{updated_shift.end} == #{old_end}"
      end
    end
  end

  test 'shift should not update when setting end before start' do
    assert @shift.start < @shift.end, "Initial ending time (#{@shift.end}) is before starting time (#{@shift.start})"

    patch :update, id: @shift, shift: {
        end: @shift.start - 1.hour
    }

    assert @shift.start < @shift.end
  end

  test 'should destroy shift' do
    assert_difference('Shift.count', -1) do
      delete :destroy, id: @shift
    end

    assert_redirected_to shifts_path
  end

  test 'should be able to associate a shift with a user' do
    assert false
  end

  test 'API - /shifts.json sends empty response with no shifts' do
    assert_routing '/shifts.json', { :controller => 'shifts', :action => 'index', :format => 'json' }

    Shift.delete_all

    get :index, { 'format' => 'json' }

    assert response.status == 200, "Incorrect response: #{response.status}"

    body = JSON.parse(response.body)

    assert body.length == 0, "Length of response should be zero it is #{body.length}"
  end

  test 'API - /shifts.json sends all shifts' do
    assert_routing '/shifts.json', { :controller => 'shifts', :action => 'index', :format => 'json' }

    assert Shift.count != 0, 'Shifts need to exist as a precondition for this test'

    get :index, { 'format' => 'json' }

    assert response.status == 200

    body = JSON.parse(response.body)

    assert body.length == Shift.count, "Length of response(#{body.length}) does not match shift count(#{Shift.count})"

    puts 'wat'
    body.each do |key, value|
      puts key
      puts value
    end

    assert false, "#{body.to_s}"

  end
end
