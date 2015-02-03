require 'test_helper'

class ThreejsControllerTest < ActionController::TestCase
  test "should get height-displacement" do
    get :height-displacement
    assert_response :success
  end

end
